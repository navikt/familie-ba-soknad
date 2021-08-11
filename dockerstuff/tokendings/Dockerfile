FROM openjdk:15-jdk-alpine as builder
RUN apk add git
RUN git clone https://github.com/nais/tokendings.git /tokendings && cd /tokendings && git checkout 6cbbe9b
WORKDIR /tokendings
COPY ./gitdiff /gitdiff
RUN git apply /gitdiff && ./gradlew --no-daemon build -x test


FROM navikt/java:15 as runner
COPY --from=builder --chown=apprunner:apprunner /tokendings/build/libs/app-*.jar /app/app.jar