# --- Stage 1: Build ---
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
# RUN mvn dependency:go-offline -B  # Опціонально для кешування залежностей
COPY src ./src
RUN mvn package -DskipTests -B

# --- Stage 2: Runtime ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ENV SPRING_DATASOURCE_URL="jdbc:postgresql://postgres_db:5433/mydatabase"
ENV SPRING_DATASOURCE_USERNAME="myuser"
ENV SPRING_DATASOURCE_PASSWORD="secret"
ENV SPRING_DATASOURCE_DRIVER="org.postgresql.Driver"
ENV SERVER_PORT=8080
COPY --from=builder /build/target/minAuthProj-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]