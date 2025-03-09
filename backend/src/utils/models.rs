use serde::Deserialize;

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct WeatherResponse {
    pub coord: Coord,
    pub weather: Vec<Weather>,
    pub base: String,
    pub main: MainData,
    pub visibility: u64,
    pub wind: Wind,
    pub clouds: Clouds,
    pub dt: u64,
    pub sys: Sys,
    pub timezone: i64,
    pub id: u64,
    pub name: String,
    pub cod: u16,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Coord {
    pub lon: f64,
    pub lat: f64,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Weather {
    pub id: u32,
    pub main: String,
    pub description: String,
    pub icon: String,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct MainData {
    pub temp: f64,
    pub feels_like: f64,
    pub temp_min: f64,
    pub temp_max: f64,
    pub pressure: u32,
    pub humidity: u32,
    pub sea_level: u32,
    pub grnd_level: u32,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Wind {
    pub speed: f64,
    pub deg: u32,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Clouds {
    pub all: u32,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Sys {
    #[serde(rename = "type")]
    pub sys_type: Option<u8>, // Using Option since it might be absent or change in future responses
    pub id: u32,
    pub country: String,
    pub sunrise: u64,
    pub sunset: u64,
}
