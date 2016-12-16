# SayonaraJS
Code It Once. Drop it Off. Sayonara!

![Sayonara Logo](https://files.aaronthedev.com/$/e7dz8)

![Sayonara Setup](https://files.aaronthedev.com/$/zuzsf)

## What is Sayonara JS?
Sayonara JS is a **Highly un-opinionated** CMS/Framework build on top of the MEAN stack.
Meaning it uses [MongoDB](https://www.mongodb.com/), [Express](http://expressjs.com/), [Angular JS](https://angularjs.org/), [Node JS](https://nodejs.org/en/).
Sayonara JS allows Developers to create portfolios, blogs, shopping sites, and much more, by piggy-backing off of the Sayonara's API. Sayonara comes with an user-friendly admin panel for its API, that allows clients to edit their content and information, without any code! Sayonara strives to be the solution for when the local bakery needs a new website, or a friend needs something quick to show at a conference, without the developer having to make "small tweaks" on a regular basis. Which is why we strive to achieve this motto: "Code It Once. Drop it Off. Sayonara!".

## How can I install Sayonara JS?
Sayonara can be installed in 7 easy steps!

1. [Install Nodejs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04)

2. [Install MongoDB](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)

3. Download the latest release of Sayonara JS

4. Extract the release, `cd` into the directory, and run `npm install`

5. Install a Node server monitor, I prefer [forever](https://www.npmjs.com/package/forever), `npm install forever -g`

6. Still inside the Sayonara directory, run `forever app.js`, or whatever server monitor you prefer

7. Follow the Server instructions, navigate to [http://localhost:8000](http://localhost:8000) and setup your site!


## Any examples of this admin panel?
Yup, here is a .gif of me changing some content in the debug client using the admin panel!

![Sayonara Admin](https://files.aaronthedev.com/$/hxpks)

## How can I learn how to use Sayonara JS?
**Documentation coming soon!**
Quick Tips,, the default theme is goodbye, which is a **client for debugging**, you can try and mimmick it's actions: Make a request to the /api/public route to return all public information of your site, and then iterate through the json to build the site on the client, using something like angular's ng-repeat, or [somthing like this in React](https://angulartoreact.com/ng-repeat-react-equivalent/), etc...

## Sayonara JS vs. Framework X
**Coming Soon!**

## Is SayonaraJS ready for production?
No, No, No. Sayonara JS is currently in Alpha. Right now, it still needs ALOT of work, and somethings may be changing down the line. I'd suggest using Sayonara currently to help in its development, or you are looking to build something for yourself. For Instance, I am using Sayonara on my personal portfolio website. And I may make some other websites in my free time using Sayonara, but I would not use Sayonara for ANY serious job I would be getting paid to do currently.

##Contributing to Sayonara
**Coming Soon**


P.S Sayonara logo done by [Leah Garza](https://leahrosegarza.com/)
