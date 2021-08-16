FROM openjdk:15-jdk-alpine
ARG github_username
ARG github_token

RUN test -n "$github_username" \
    && test -n "$github_token" \
    && apk add git maven

RUN git clone https://github.com/navikt/familie-dokument.git /app
WORKDIR /app

ENV GITHUB_USERNAME=$github_username
ENV GITHUB_TOKEN=$github_token

RUN mvn clean install --settings .m2/maven-settings.xml

# Unmock mottak and jwt validation, set up tokenx
COPY ./gitdiff gitdiff
RUN git apply ./gitdiff

COPY ./dokument-magic-invocation.sh /dokument-launch.sh
CMD ["/dokument-launch.sh"]