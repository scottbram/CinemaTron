# Cinematron
A demo project for a position at SANS.

## Deploy Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/05a179f2-ccff-41fd-9d0d-838ebaadb61e/deploy-status)](https://app.netlify.com/sites/sans-demo/deploys)

## Objective
Build a website with a database backend for storing a movie collection. Please use PHP or NodeJS to deliver the application on whatever server infrastructure you prefer.

1. Start by creating a development environment of your choosing. Let us know what you'll be implementing.
1. Setup a source code repository where we can watch your progress. GitHub or Bitbucket are fine.
1. You'll need to deploy your application to a hosting service of your choosing (AWS, DigitalOcean, Azure, etc). Free tiers should be sufficient.

## Requirements
1. Give the app a "branded" unique name, with an associated look and feel. You can leverage standard frontend libraries as necessary.
1. The app must create, read, update, delete, and list movies in the collection
1. Each movie in the collection needs the following attributes:
    a. Title [text; length between 1 and 50 characters]
    b. Format [text; allowable values "VHS", "DVD", "Streaming"]
    c. Length [time; value between 0 and 500 minutes]
    d. Release Year [integer; value between 1800 and 2100]
    e. Rating [integer; value between 1 and 5]
1. App requires a landing page (index), listing page, and details page/view. Create menus/links as appropriate to navigate the site.
1. Responsive design is required to support multiple screen sizes.
1. On the collection list page, the items in the list must be sortable by movie attributes.

## Extra Credit (none, any, or all)
1. Implement a build tool of your choosing
1. Add a user model and authentication
1. Integrate a third-party web service relevant to the project
1. Integrate a testing suite of some sort

## Misc. reqs.
- Support for IE, if poss.
- Breakpoints
    + Consistent UI thru 768px

## Tentative plans
- Repo: Github
    - https://github.com/scottbram/sans-demo
        - Currently private
        - I can add you as a contributor and/or make it public, as needed
        - I'll be using /src for source code & /dist for compiled files
- Host: Netlify
    - https://sans-demo.netlify.com/
    - Includes continuous deployment from the Github repo with build tool of choice
    - Includes branch builds at unique URLs (I'll send those along once created)
- Build tool/taskrunner: GulpJS (https://gulpjs.com/)
    - This is my current task runner of choice based on the scale of projects I've needed a build solution for
    - I've done a little with Webpack but found its powers require complexity that is overkill for smaller projects
    - Compiles as well as utility tasks like linting and minifying
- Data store: (TBD)
    - Will be working in JSON, standardizing all response values as strings
    - Initial thought is Airtable since I've recent good experience with them and have gotten it working well with Netlify (which uses AWS Lambda functions)
    - May just go with a NoSQL or just something flat & simple since CRUD requirements were basic
- Frameworks & libraries
    - Bootstrap
        - Using the typical CSS and JS
    - jQuery
        - Esp. for DOM manipulation, events, and loops/array handling
        - Probably for AJAX & promises as well, although I may look at the comparable native ES6 features

