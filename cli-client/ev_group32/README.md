ev_group32
=========

The cli-client of Charging Point

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
Fill out your config files, config/dev.json and config/test.json and then:

```sh-session
cd to dir ./cli-client/ev_group32 and run:
$ sudo npm link
$ ev_group32 COMMAND
running command...
$ ev_group32 (-v|--version|version)
ev_group32/1.0.0 linux-x64 node-v12.18.2
$ ev_group32 --help [COMMAND]
USAGE
  $ ev_group32 COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ev_group32 addPoint`](#ev_group32-addpoint)
* [`ev_group32 addReview`](#ev_group32-addreview)
* [`ev_group32 addStation`](#ev_group32-addstation)
* [`ev_group32 admin`](#ev_group32-admin)
* [`ev_group32 chargingPercentage`](#ev_group32-chargingpercentage)
* [`ev_group32 deletePoint`](#ev_group32-deletepoint)
* [`ev_group32 deleteStation`](#ev_group32-deletestation)
* [`ev_group32 editStation`](#ev_group32-editstation)
* [`ev_group32 estimatedTimeAndCost`](#ev_group32-estimatedtimeandcost)
* [`ev_group32 getCostPerStation`](#ev_group32-getcostperstation)
* [`ev_group32 getPoint`](#ev_group32-getpoint)
* [`ev_group32 healthcheck`](#ev_group32-healthcheck)
* [`ev_group32 help [COMMAND]`](#ev_group32-help-command)
* [`ev_group32 kilometersDriven`](#ev_group32-kilometersdriven)
* [`ev_group32 login`](#ev_group32-login)
* [`ev_group32 logout`](#ev_group32-logout)
* [`ev_group32 periodicBill`](#ev_group32-periodicbill)
* [`ev_group32 resetsessions`](#ev_group32-resetsessions)
* [`ev_group32 sessionsPerEV`](#ev_group32-sessionsperev)
* [`ev_group32 sessionsPerPoint`](#ev_group32-sessionsperpoint)
* [`ev_group32 sessionsPerProvider`](#ev_group32-sessionsperprovider)
* [`ev_group32 sessionsPerStation`](#ev_group32-sessionsperstation)

## `ev_group32 addPoint`

add a new point to a station

```
USAGE
  $ ev_group32 addPoint

OPTIONS
  --apikey=apikey    the api key used for authorization
  --format=json|csv  (required) [default: json]
  --station=station  (required) the id of the station
```

_See code: [src/commands/addPoint.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/addPoint.js)_

## `ev_group32 addReview`

add a review to a station

```
USAGE
  $ ev_group32 addReview

OPTIONS
  --apikey=apikey    (required) the api key used for authorization
  --comment=comment  (required) extra comments for the review
  --date=date        (required) the date that the review has been made
  --format=json|csv  (required) [default: json]
  --rating=rating    (required) the rating for the station
  --station=station  (required) the station to add the review to
  --user=user        (required) the user that writes the review
```

_See code: [src/commands/addReview.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/addReview.js)_

## `ev_group32 addStation`

add a new station

```
USAGE
  $ ev_group32 addStation

OPTIONS
  --address=address                (required) the address of the station to be added
  --apikey=apikey                  the api key used for authorization
  --energyProvider=energyProvider  (required) the energy provider for the station to be adde
  --format=json|csv                (required) [default: json]
  --operator=operator              (required) the operator of the station to be added
  --stationName=stationName        (required) the name of the station to be added
  --user=user                      (required) the user that has the station
```

_See code: [src/commands/addStation.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/addStation.js)_

## `ev_group32 admin`

system management calls

```
USAGE
  $ ev_group32 admin

OPTIONS
  --apikey=apikey      the api key used for authorization
  --format=json|csv    [default: json]
  --healthcheck        tests live server for errors
  --passw=passw        Your password
  --resetsessions      reset evcharge data and insert default admin to the db
  --sessionsupd        upload charging session data to the database. should be used with --source
  --source=source      the file to upload to the server. it can only be a csv file

  --usermod            insert a new user to the database or change an existing user's password. should be used with
                       --username --passw

  --username=username  Your username

  --users              get details for a specific user. should be used with --username
```

_See code: [src/commands/admin.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/admin.js)_

## `ev_group32 chargingPercentage`

return the charging percentage in the given point

```
USAGE
  $ ev_group32 chargingPercentage

OPTIONS
  --capacity=capacity  (required) the current capacity of the car's battery
  --ev=ev              (required) the vehicle to search for
  --format=json|csv    (required) [default: json]
```

_See code: [src/commands/chargingPercentage.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/chargingPercentage.js)_

## `ev_group32 deletePoint`

get information about a station point

```
USAGE
  $ ev_group32 deletePoint

OPTIONS
  --apikey=apikey    the api key used for authorization
  --format=json|csv  (required) [default: json]
  --point=point      (required) the id of the point to search
```

_See code: [src/commands/deletePoint.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/deletePoint.js)_

## `ev_group32 deleteStation`

add a new station

```
USAGE
  $ ev_group32 deleteStation

OPTIONS
  --apikey=apikey    the api key used for authorization
  --format=json|csv  (required) [default: json]
  --station=station  (required) the id of the station to be modified
  --user=user        (required) the id of user that has the station
```

_See code: [src/commands/deleteStation.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/deleteStation.js)_

## `ev_group32 editStation`

add a new station

```
USAGE
  $ ev_group32 editStation

OPTIONS
  --address=address                (required) the address of the station to be added
  --apikey=apikey                  the api key used for authorization
  --energyProvider=energyProvider  (required) the energy provider for the station to be adde
  --format=json|csv                (required) [default: json]
  --operator=operator              (required) the operator of the station to be added
  --station=station                (required) the id of the station to be modified
  --stationName=stationName        (required) the name of the station to be added
  --user=user                      (required) the id of user that has the station
```

_See code: [src/commands/editStation.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/editStation.js)_

## `ev_group32 estimatedTimeAndCost`

return the estimated time for the car to charge

```
USAGE
  $ ev_group32 estimatedTimeAndCost

OPTIONS
  --capacity=capacity  (required) the current capacity of the car
  --ev=ev              (required) the id of the car to search
  --format=json|csv    (required) [default: json]
  --mode=mode          (required) the charge mode
```

_See code: [src/commands/estimatedTimeAndCost.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/estimatedTimeAndCost.js)_

## `ev_group32 getCostPerStation`

return total bill for the station in a certain period

```
USAGE
  $ ev_group32 getCostPerStation

OPTIONS
  --datefrom=datefrom  (required)
  --dateto=dateto      (required)
  --format=json|csv    (required) [default: json]
  --station=station    (required)
```

_See code: [src/commands/getCostPerStation.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/getCostPerStation.js)_

## `ev_group32 getPoint`

get information about a station point

```
USAGE
  $ ev_group32 getPoint

OPTIONS
  --apikey=apikey    the api key used for authorization
  --format=json|csv  (required) [default: json]
  --point=point      (required) the id of the point to search
```

_See code: [src/commands/getPoint.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/getPoint.js)_

## `ev_group32 healthcheck`

tests live server for errors

```
USAGE
  $ ev_group32 healthcheck

OPTIONS
  --format=json|csv  (required) [default: json]
```

_See code: [src/commands/healthcheck.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/healthcheck.js)_

## `ev_group32 help [COMMAND]`

display help for ev_group32

```
USAGE
  $ ev_group32 help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ev_group32 kilometersDriven`

get kilometers driven between two sessions

```
USAGE
  $ ev_group32 kilometersDriven

OPTIONS
  --ev=ev                      (required) the id of the car to search
  --format=json|csv            (required) [default: json]
  --sessionEnd=sessionEnd      (required) the last session
  --sessionStart=sessionStart  (required) the starting session
```

_See code: [src/commands/kilometersDriven.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/kilometersDriven.js)_

## `ev_group32 login`

login to the server to get your api-key. On successful response, the api-key is saved on {home}/softeng20bAPI.token/

```
USAGE
  $ ev_group32 login

OPTIONS
  --passw=passw        (required) Your password
  --username=username  (required) Your username
```

_See code: [src/commands/login.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/login.js)_

## `ev_group32 logout`

logout of the current session using your api-key. The file 'softeng20bAPI.token' is deleted

```
USAGE
  $ ev_group32 logout

OPTIONS
  --apikey=apikey    (required) the api key used for authorization
  --format=json|csv  (required) [default: json]
```

_See code: [src/commands/logout.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/logout.js)_

## `ev_group32 periodicBill`

return total bill for all charging sessions in a certain period

```
USAGE
  $ ev_group32 periodicBill

OPTIONS
  --datefrom=datefrom  (required)
  --dateto=dateto      (required)
  --ev=ev              (required) the id of the car to search
  --format=json|csv    (required) [default: json]
```

_See code: [src/commands/periodicBill.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/periodicBill.js)_

## `ev_group32 resetsessions`

reset evcharge data and insert default admin to the db

```
USAGE
  $ ev_group32 resetsessions

OPTIONS
  --format=json|csv  (required) [default: json]
```

_See code: [src/commands/resetsessions.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/resetsessions.js)_

## `ev_group32 sessionsPerEV`

return info about the charging sessions that an electric vehicle has done

```
USAGE
  $ ev_group32 sessionsPerEV

OPTIONS
  --datefrom=datefrom  (required)
  --dateto=dateto      (required)
  --ev=ev              (required) the id of the car to search
  --format=json|csv    (required) [default: json]
```

_See code: [src/commands/sessionsPerEV.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/sessionsPerEV.js)_

## `ev_group32 sessionsPerPoint`

return  info about the charging sessions on a certain point

```
USAGE
  $ ev_group32 sessionsPerPoint

OPTIONS
  --datefrom=datefrom  (required)
  --dateto=dateto      (required)
  --format=json|csv    (required) [default: json]
  --point=point        (required) the id of the point to search
```

_See code: [src/commands/sessionsPerPoint.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/sessionsPerPoint.js)_

## `ev_group32 sessionsPerProvider`

return info about the charging sessions that a provider has

```
USAGE
  $ ev_group32 sessionsPerProvider

OPTIONS
  --datefrom=datefrom  (required)
  --dateto=dateto      (required)
  --format=json|csv    (required) [default: json]
  --provider=provider  (required) the id of the provider to search
```

_See code: [src/commands/sessionsPerProvider.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/sessionsPerProvider.js)_

## `ev_group32 sessionsPerStation`

return info about the charging sessions on a certain station

```
USAGE
  $ ev_group32 sessionsPerStation

OPTIONS
  --datefrom=datefrom  (required)
  --dateto=dateto      (required)
  --format=json|csv    (required) [default: json]
  --station=station    (required) the id of the station to search
```

_See code: [src/commands/sessionsPerStation.js](https://github.com/ntua/TL20-32/blob/v1.0.0/src/commands/sessionsPerStation.js)_
<!-- commandsstop -->
