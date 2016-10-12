# Snow Report

A service to get snow data from the NOAA for Cascadian mountains and ski areas.
The API provides a [HAL-like][hal] interface, so it should be reasonably
discoverable.

## Up and running

1. Check out the repo
2. `npm i`
3. Add environment variables to a `.env` file
  * `NOAA_API_BASE` (required; probably http://www.ncdc.noaa.gov/cdo-web/api/v2/)
  * `NOAA_TOKEN` (required; request one from [NOAA CDO][token])
  * `PORT` (optional; default is `3000`)
  * `LOG_FILE` (optional; default is `/dev/null`)
  * `LOG_LEVEL` (optional; set to `verbose`, `debug`, or `silly` to log to the console)
4. `npm start`

## Supported areas

This depends on weather station data, which necessarily limits the areas for
which relevant data is available. Over time, I would love to add new areas, so
feel free to poke around the [NOAA daily summaries station list][ghcnd] to find
more. The ones included now:

1. Mount Baker (Nooksack)
2. Mount Hood (Test Station)
3. Mount Rainier (Paradise)
4. Stevens Pass
5. White Pass

## Alexa skill

You can find the code for the skill that connects to this API in the
`snow-report/skill` directory. It's early days there.

[ghcnd]: http://www.ncdc.noaa.gov/cdo-web/search?datasetid=GHCND
[hal]:   http://stateless.co/hal_specification.html
[token]: http://www.ncdc.noaa.gov/cdo-web/token
