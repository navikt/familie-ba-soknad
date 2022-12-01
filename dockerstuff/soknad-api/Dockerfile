FROM openjdk:17-jdk-alpine
ARG github_username
ARG github_token
ARG git_commit

RUN apk add git maven

RUN git clone https://github.com/navikt/familie-baks-soknad-api.git /app \
    && cd /app \
    && git checkout $git_commit
WORKDIR /app

# Unmock mottak and jwt validation, set up tokenx
COPY ./gitdiff gitdiff
RUN git apply ./gitdiff

ENV GITHUB_USERNAME=$github_username
ENV GITHUB_TOKEN=$github_token

RUN mvn clean install --settings .m2/maven-settings.xml

COPY ./soknad-magic-invocation.sh /soknad-launch.sh
CMD ["/soknad-launch.sh"]