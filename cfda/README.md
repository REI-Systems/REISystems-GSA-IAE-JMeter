# Data Entry JMeter Scripts

## Quickstart

1. Create a [properties file](#properties) and fill in the appropriate values

2. Run JMeter with the properties file `jmeter -q /path/to/properties`

If not using the included JMeter installation, then also [rebuild the custom JAR](#update-jar) and copy the dependency JARs in `gmail-otp/libs/` to your JMeter directory's `lib/ext/`. The included JMeter installation already has the required JARs.

## Build Prerequisites

- JDK 1.8+: [Download](http://www.oracle.com/technetwork/java/javase/downloads/index.html), [Install](http://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) -- *Check using `java -version`*

- Gradle 4.1+: [Install](https://gradle.org/install/) (or use included gradlew wrapper) -- *Check using `gradle --version`*

## <a id="update-jar"></a>Updating Custom JAR

1. `cd` into `gmail-otp` directory

2. If building for the first time, download credentials necessary to access Google APIs

    2a. Go to the [Google API Console](https://console.developers.google.com/) and create a new OAuth web application credential if necessary
    
    2b. Download the `client_secrets.json` file for the credential and place it in `src/main/resources/`
    
3. Build the project with `./gradlew build` (Unix) or `gradlew.bat build` (Windows)

4. Copy the JAR created in `build/libs/` to your JMeter directory's `lib/ext/`

## <a id="properties"></a>Properties File

The scripts will read properties from a file passed to JMeter.

`example.properties` provides a template that can be filled out.

It contains the following properties:

* `env` - one of {`dev`, `comp`, `minc`, `prodlike`, `prod`}
* `url` - the base url that all API calls will go to ex. `api-umbrella.prod-iae.bsp.gsa.gov/comp`
* `api_key` - the api key to send with all API calls
* `agency_coord_username` - the username to use when logging in as agency coordinator
* `agency_submitter_username` - the username to use when logging in as agency submitter
* `superuser_username` - the username to use when logging in as superuser
* `password` - the password to use when logging in as any user

