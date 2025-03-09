use crate::entities::{prelude::*, weathers};
use crate::utils::models::WeatherResponse;
use axum::{extract::Path, http::StatusCode, response::IntoResponse};
use chrono::{DateTime, Local};
use chrono_tz::America::Chicago;
use dotenv::dotenv;
use sea_orm::{Database, EntityTrait, Set};
use std::env;
use std::error::Error;

async fn get_lat_lon() -> Result<(f64, f64), Box<dyn Error + Send + Sync>> {
    let response =
        reqwest::get("https://ipinfo.io/json").await?.json::<serde_json::Value>().await?;
    let loc = response["loc"].as_str().ok_or("Missing location")?;
    let coords: Vec<&str> = loc.split(',').collect();
    let lat = coords[0].parse::<f64>()?;
    let lon = coords[1].parse::<f64>()?;
    println!("lat: {}, lon: {}", lat, lon);
    Ok((lat, lon))
}

async fn call_openweather(
    lat: f64,
    lon: f64,
) -> Result<WeatherResponse, Box<dyn Error + Send + Sync>> {
    dotenv().ok();
    let api_key = env::var("OPENWEATHER_API_KEY").expect("OPENWEATHER_API_KEY must be set");

    let url = format!(
        "https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}&units=metric",
        lat, lon, api_key
    );

    let response = reqwest::get(&url).await?.json::<WeatherResponse>().await?;
    Ok(response)
}

async fn fetch_weather_online() -> Result<WeatherResponse, Box<dyn Error + Send + Sync>> {
    let (lat, lon) = get_lat_lon().await?;
    let response: WeatherResponse = call_openweather(lat, lon).await?;
    println!("The weather in your location is: {:?}", response);
    Ok(response)
}

#[utoipa::path(get, path = "/load_weather", responses( (status = 200, description = "load weather info to db", body = String)))]
pub async fn load_weather_to_db() -> Result<(), Box<dyn Error + Send + Sync>> {
    match fetch_weather_online().await {
        Ok(response) => {
            dotenv().ok();
            let url: String = env::var("MYSQL_DATABASE_URL").expect("DATABASE_URL must be set");
            let db = &Database::connect(url).await.unwrap();

            let now_local = Local::now().naive_local();
            let sunrise_time = DateTime::from_timestamp(response.sys.sunrise as i64, 0)
                .unwrap()
                .with_timezone(&Chicago)
                .time();

            let sunset_time = DateTime::from_timestamp(response.sys.sunset as i64, 0)
                .unwrap()
                .with_timezone(&Chicago)
                .time();

            let new_weather = weathers::ActiveModel {
                record_time: Set(now_local),
                description: Set(Some(response.weather[0].description.to_owned())),
                temp: Set(response.main.temp as f32),
                temp_max: Set(Some(response.main.temp_max as f32)),
                temp_min: Set(Some(response.main.temp_min as f32)),
                humidity: Set(Some(response.main.humidity as f32)),
                wind: Set(Some(response.wind.speed as f32)),
                wind_deg: Set(Some(response.wind.deg as f32)),
                cloud: Set(Some(response.clouds.all as i32)),
                city: Set(Some(response.name.to_owned())),
                sunrise: Set(Some(sunrise_time)),
                sunset: Set(Some(sunset_time)),
                ..Default::default()
            };
            match Weathers::insert(new_weather).exec_with_returning(db).await {
                Ok(_) => Ok(()),
                Err(e) => {
                    eprintln!("Database insert error: {:?}", e);
                    Err(Box::new(e))
                }
            }
        }
        Err(e) => {
            eprintln!("Error fetching weather: {:?}", e);
            Err(e)
        }
    }
}

#[utoipa::path(get, path = "/load_weather", responses( (status = 200, description = "load weather info to db", body = String)))]
pub async fn load_weather_to_db_handler() -> impl IntoResponse {
    match load_weather_to_db().await {
        Ok(_) => StatusCode::CREATED.into_response(),
        Err(e) => {
            eprintln!("Failed to load weather: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

#[utoipa::path(get, path = "/recent_weather", responses( (status = 200, description = "fetch weather info", body = String)))]
pub async fn read_weather() -> impl IntoResponse {
    dotenv().ok();
    let url: String = env::var("MYSQL_DATABASE_URL").expect("DATABASE_URL must be set");
    let db = &Database::connect(url).await.unwrap();
    let last_record = weathers::Entity::get_latest_record(&db).await;
    last_record
}

#[utoipa::path(get, path = "/weather_history/{city}", responses( (status = 200, description = "fetch temperature history", body = String)))]
pub async fn get_weather_history(Path(city): Path<String>) -> impl IntoResponse {
    dotenv().ok();
    let url = env::var("MYSQL_DATABASE_URL").expect("DATABASE_URL must be set");
    let db = &Database::connect(url).await.unwrap();

    match weathers::Entity::get_last_n_temp_records(&db, 10, city).await {
        Ok(chart_data) => chart_data.into_response(),
        Err(e) => {
            eprintln!("Error fetching weather history: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch weather history").into_response()
        }
    }
}
