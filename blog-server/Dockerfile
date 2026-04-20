FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

COPY blog-server/pom.xml ./pom.xml
RUN mvn -B -q dependency:go-offline

COPY blog-server/src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/blog-server-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
