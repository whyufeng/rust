mod entities;
mod utils;

use axum::{http::Method, routing::get, Router};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};
use utils::helpers::api_doc;
use utils::weather::{get_weather_history, load_weather_to_db_handler, read_weather};
use utoipa_swagger_ui::SwaggerUi;

#[tokio::main]
async fn main() {
    // tokio::spawn creates a new task that can run on any thread
    tokio::spawn(async {
        utils::scheduler::scheduler().await; // Must be Send + Sync
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/status", get(utils::helpers::check_status))
        .route("/recent_weather", get(read_weather))
        .route("/load_weather", get(load_weather_to_db_handler))
        .route("/weather_history/{city}", get(get_weather_history))
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", api_doc()))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service()).await.unwrap();
}
