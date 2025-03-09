use super::weather::{__path_get_weather_history, __path_load_weather_to_db, __path_read_weather};
use utoipa::OpenApi;

pub fn api_doc() -> utoipa::openapi::OpenApi {
    #[derive(OpenApi)]
    #[openapi(
    paths(read_weather, check_status, load_weather_to_db, get_weather_history),
    tags( (name = "Backend API Test", description = "Test Tools"))
)]
    struct ApiDoc;
    ApiDoc::openapi()
}

#[utoipa::path(get,path = "/status", responses(
    (status = 200, description = "Check server status", body = [String])
))]
pub async fn check_status() -> &'static str {
    println!("Server is running");
    "Ok!"
}
