# Nexxx Studio - Channels

This project is a web-based platform for browsing and watching video channels, developed by Nexxx Studio. It features a modal player, search functionality, and fetches channel data from an external API.

## Setup

To run this project, you will need a modern web browser and a local web server.

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/nexxx-studio-channels.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd nexxx-studio-channels
    ```
3.  Start a local web server. You can use any simple web server, for example, Python's `http.server`:
    ```bash
    python -m http.server
    ```
4.  Open your web browser and go to `http://localhost:8000` to view the application.

## Usage

-   **Browse Channels:** Scroll through the grid to see the available channels.
-   **Watch a Channel:** Click on any channel card to open the player in a modal window.
-   **Search for a Channel:** Use the search bar at the top of the page to filter channels by name.
-   **Close the Player:** Click the "×" button or press the "Esc" key to close the player.

## Project Structure

-   `index.html`: The main HTML file.
-   `styles.css`: The stylesheet for the application.
-   `app.js`: The JavaScript file that contains the application's logic.
-   `imagens/`: A directory containing images used in the application.

## API

The channel data is fetched from the following API endpoint:

`https://api.reidoscanais.io/channels`
