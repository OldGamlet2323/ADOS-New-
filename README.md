# ADOS Project

This is a project for Automation of the process of notification and control of the implementation of elements of the daily routine of the military unit on duty by developing
the appropriate subsystem architecture and justifying its functional capabilities.

## Getting Started with Docker Compose

The project is fully containerized and can be run using Docker Compose.

### Prerequisites

- Docker
- Docker Compose
- Git (for cloning the repository with submodules)

### Clone the Repository

Clone this repository with all submodules:

HTTPS
```bash
git clone --recurse-submodules https://github.com/MITIT-DEP22/ADOS.git
```
SSH
```bash
git clone --recurse-submodules git@github.com:MITIT-DEP22/ADOS.git
```
### Create Your Environment

You need to create a `.env` file to run this application. Check `example.env` for required environment variables. You can also add additional variables.

Required environment variables:
- `DB_NAME` - your database name
- `DB_PASSWORD` - your database password
- `DB_USER` - your database username
- `DB_URL` - your databse url conection


### Runing Backend:
To start the backend, you need to run:
```bash
sudo docker compose build
```

```bash
sudo  docker compose up
```
For frontedn, perform the same actions.

### Stoping Backedn and Frontend

To stop Backend and Frontend: 
```bash
sudo docker compose down
```

### Accessing the Application

- Frontend: http://localhost:8081
- Backend: http://localhost:8080

### Project Structure

- `/front/ADOS/` - Frontend application
- `/back/ADOS/` - Backend application

## Troubleshooting

### Common Issues

#### Docker-related Issues

- **Error: Database connection failed**
  - Solution: Check your database credentials in `.env` file
  - Ensure the database container is running with `docker ps`
  - Try restarting the database container: `docker compose restart db`

- **Error: Backend Issues**
  - Solution: Check backend to make sure there are 5430
  - Check the conection on the database

---
# Проект ADOS


Це проект з автоматизації процесу повідомлення та контролю виконання елементів щоденної рутини військової частини, що несе службу, шляхом розробки
відповідної архітектури підсистеми та обґрунтування її функціональних можливостей.

## Початок роботи з Docker Compose

Проект повністю контейнеризований і може бути запущений за допомогою Docker Compose.

### Необхідні умови

- Docker
- Docker Compose
- Git (для клонування репозиторію з підмодулями)

### Клонування репозиторію

Клонуйте цей репозиторій з усіма підмодулями:

HTTPS
```bash
git clone --recurse-submodules https://github.com/MITIT-DEP22/ADOS.git
```
SSH
```bash
git clone --ecurse-submodules git@github.com:MITIT-DEP22/ADOS.git
```
### Створення середовища

Для запуску цієї програми необхідно створити файл `.env`. Перевірте `example.env` для необхідних змінних середовища. Ви також можете додати додаткові змінні.

Необхідні змінні середовища:
- `DB_NAME` - назва вашої бази даних
- `DB_PASSWORD` - пароль до вашої бази даних
- `DB_USER` - ім'я користувача вашої бази даних
- `DB_URL` - URL-адреса підключення до вашої бази даних

### Запуск програми 

Щоб запустити сервіси інтерфейсу та серверної частини, вам потрібно написати для кожного з них наступне:

```bash
sudo docker compose up
```
Це дозволить:
- Запустити базу даних PostgresSQL
- Запустити фронтенд  на порту 3000
- Запустити бекенд на порту 8081

### Доступ до програми

- Фронтенд: http://localhost:3000
- Бекенд: http://localhost:8081

### Зупинка програми

Щоб зупинити всі служби: 
```bash
docker compose down
```

### Структура проекту

- `/front/ADOS/` - Фронтенд-програма
- `/back/ADOS/` - Бекенд-програма

## Усунення несправностей

### Поширені проблеми

#### Проблеми, пов'язані з Docker

- **Помилка: Не вдалося підключитися до бази даних**
  - Рішення: Перевірте свої облікові дані бази даних у файлі `.env`.
  - Переконайтеся, що контейнер бази даних працює за допомогою `docker ps`.
  - Спробуйте перезапустити контейнер бази даних: `docker compose restart db`.

- **Помилка: Проблеми з бекендом**
  - Рішення: Перевірте бекенд, щоб переконатися, що є 5430.
  - Перевірте з'єднання з базою даних.
