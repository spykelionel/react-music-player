# Music App

## Overview

This repository contains a modern music player application built with React and Vite. The app provides a responsive and engaging user interface for managing and enjoying your music library.

## Features

- **Responsive Design**: Adapts to various screen sizes.
- **Playback Controls**: Easy music playback management.
- **Real-time Updates**: Fast performance with Vite and React.

## Getting Started Locally

### Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine.
- **Docker Compose**: Ensure Docker Compose is installed.

### Cloning the Repository

1. **Clone the Repository**:

   ```bash
   git clone https://gitlab.com/your_username/your_repository.git
   cd your_repository
   ```

2. **Build and Run the Application**:

   Use Docker Compose to build and run the application:

   ```bash
   docker-compose up --build
   ```

   This will build the Docker image and start the container. The application will be accessible at `http://localhost:3000`.

### Direct Docker Commands

If you prefer to build and run the Docker image manually, follow these steps:

1. **Build the Docker Image**:

   ```bash
   docker build -t react-music-player-client .
   ```

2. **Run the Docker Container**:

   ```bash
   docker run -p 3000:3000 react-music-player-client
   ```

   This maps port `3000` on your host to port `3000` inside the container, allowing you to access the app at `http://localhost:3000`.

## Docker Image

### Pull the Image

To pull the Docker image from Docker Hub, use the following command:

```bash
docker pull spykelionel/music_app:latest
```

### Run the Docker Image

After pulling the image, you can run it with:

```bash
docker run -p 3000:3000 spykelionel/music_app:latest
```
