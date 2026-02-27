# -------- Stage 1: Build --------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copia apenas o pom primeiro (melhor uso de cache)
COPY pom.xml .

# Baixa dependências
RUN mvn -B dependency:go-offline

# Copia código fonte
COPY src ./src

# Gera o jar
RUN mvn -B clean package -DskipTests


# -------- Stage 2: Runtime --------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia o jar gerado (nome fixo evita problemas)
COPY --from=build /app/target/app-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]