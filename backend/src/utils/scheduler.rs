use crate::utils::weather::load_weather_to_db;
use std::error::Error;
use tokio::time::{sleep, Duration};

// This needs Send + Sync because it runs in tokio::spawn
pub async fn scheduler() {
    loop {
        match fetch_and_store_weather().await {
            Ok(_) => println!("Success"),
            Err(e) => eprintln!("Error: {}", e), // e must be Send + Sync
        }
        sleep(Duration::from_secs(2 * 60 * 60)).await;
    }
}

async fn fetch_and_store_weather() -> Result<(), Box<dyn Error + Send + Sync>> {
    load_weather_to_db().await?;
    Ok(())
}
