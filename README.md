<div style="font-size: 3em; font-weight: bold; text-align: center; margin-bottom: 30px;">
Active Materials Library
</div>

---

This is the repository for the Active Materials Library, a full-stack web application made for anyone interested in [active materials](https://www.science.eus/en/groups/active-smart-materials/). You can share and reshare projects you find interesting, academic discoveries, or just explore the [homepage](#the-homepage).

**Who can use it?** Anyone - whether you're an academic, an artist or just someone interested in active materials, the library is open to you!  [Click here to get started](https://library.co.uk/).

---

**Table of Contents**
- [Technologies used](#technologies-used)
  - [Development](#development)
  - [Deployment](#deployment)
- [Features](#features)
  - [The Homepage](#the-homepage)
  - [Keywords](#keywords)
  - [Accounts](#accounts)
    - [Login/Register](#loginregister)
    - [Personal User Profile (My Profile)](#personal-user-profile-my-profile)
    - [Public User Profile](#public-user-profile)
  - [Posts](#posts)
    - [Creating Posts](#creating-posts)
    - [Managing/Editing Posts](#managingediting-posts)
    - [Bookmarking Posts](#bookmarking-posts)
  - [Main Searchbar](#main-searchbar)


<!-- === Individual language badges === -->
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)






# Technologies used

## Development

  * [**React**](https://react.dev/) -  developing the frontend
  * [**CSS**](https://en.wikipedia.org/wiki/CSS) -  styling the frontend. 
  *  [**Vite**](https://vitejs.dev/) - development server and build tool for the React frontend.  
  * [**Django (Python)**](https://www.djangoproject.com/) -  developing the backend.
  *   **SQL** - indirect use through Django
  * [**JSON Web Tokens**](https://en.wikipedia.org/wiki/JSON_Web_Token/) - user authentication.


## Deployment

* [Amazon Web Services S3 Storage](https://aws.amazon.com/pm/serv-s3/) - hosting the images and styling for the project
* [Netlify](https://www.netlify.com/) - hosting the frontend
* [Render](https://render.com/) - hosting the backend, and the PostgreSQL database



# Features
 The website has a multitude of features, the most prominent ones are mentioned below:

 ## The Homepage

 The Homepage is where users can find new posts. It also has an infinite scroll function, so you keep seeing posts as you scroll.

At the top of the page is the navigation bar which contains buttons for all other pages and the main searchbar.

<p align="center">
  <img src="readme_images\homepage.png" style="max-width: 50em" />
</p>

## Keywords

Keywords are a flexible feature which one can put onto a [post](#posts) or a [user profile](#personal-user-profile-my-profile). Users can select/create a keyword of their choice that best describes what the post is about or that best describes them and their interests. 

 ## Accounts

 ### Login/Register

To register, users must provide a valid email address, and only after **automatic email address verification** can they create an account.

 Although not necessary to explore the website, creating an account lets users post on the website and unlock account-specific functionality (such as [Bookmarks](#bookmarking-posts)) and the ability to post onto the website.
 

<p align="center">
  <img src="readme_images\login.png" />
</p>

### Personal User Profile (My Profile)

The personal user profile is only accessible to the account holder and is where they can edit their own details and [Manage Posts](#managingediting-posts). The About Section is typed in Markdown ([Guide](https://www.markdownguide.org/getting-started/)) which allows for great customisability.


<p align="center">
  <img src="readme_images\my profile.png" style="max-width: 30em" />
</p>

<p align="center">
  <img src="readme_images\profilepage.png" style="max-height: 50em; max-width: 50em" />
</p>

Users can edit their details 

<p align="center">
  <img src="readme_images\profile edit.png" style="max-width: 30em" />
</p>

Where they can also change their profile pictures, which can be cropped on the website itself. 

<p align="center">
  <img src="readme_images\cropping profile image.png" style="max-width: 50em" />
</p>

All posts on this page are shown in the form of carousels (as [here](#managingediting-posts))


### Public User Profile

A public profile is accessible to everyone visiting the site and is created for all accounts automatically. This contains details the users would like to share (set by them in the [Personal Profile](#personal-user-profile-my-profile)). The user searchbar also allows searching for a user.

<p align="center">
  <img src="readme_images\user list.png" style="max-width: 30em" />
</p>

<p align="center">
  <img src="readme_images\public profiles.png" style="max-height: 50em; max-width: 50em" />
</p>

## Posts

All registered users can make posts. The posts contain a title, a subtitle and the post content, which is typed out in Markdown ([Guide](https://www.markdownguide.org/getting-started/)). This allows users to uniquely customise their posts, while still being manageable for the application. 

Additionally, *multiple authors* (i.e. other registered users) can also be accredited in the Authors section of the post.

Posts can also contain an image, and users can put in one external link of their choice. 

A user can also *link* other posts, creating a thread so that readers can gain context from earlier contributions.

Lastly, the author of a post can also indicate whether they claim the work as original or not - in the case they are making a post of someone else's ideas.

<p align="center">
  <img src="readme_images\post.png" style="max-height: 50em; max-width: 50em"/>
</p>


**Post Moderation** - Currently, posts are moderated by staff who check the links/images/text are safe. Users can also report posts; however this functionality is currently unfinished. Please report any posts to the official email account until changes are made to this section.

### Creating Posts

To create a new post, you must be logged in. Simply click on the plus icon in the navigation bar.
<p align="center">
  <img src="readme_images\create post.png" style="max-height: 50em; max-width: 50em"/>
</p>

### Managing/Editing Posts

Users can manage or edit posts from their [Personal Profile](#personal-user-profile-my-profile). 

<p align="center">
  <img src="readme_images\carousel.png" style="max-height: 50em; max-width: 50em"/>
</p>

Posts made by the user can be fully edited, with images able to be cropped similarly to profile images.

<p align="center">
  <img src="readme_images\post editing and deletion.png" style="max-height: 50em; max-width: 50em"/>
</p>

<p align="center">
  <img src="readme_images\post editor.png" style="max-height: 50em; max-width: 50em"/>
</p>

Additionally, the content editor for a post can be expanded for ease of use.

<p align="center">
  <img src="readme_images\content editor.png" style="max-height: 50em; max-width: 50em"/>
</p>

### Bookmarking Posts

While exploring the Homepage, users can bookmark posts by clicking on the icon shown below. Bookmarked posts will show up on their [Personal Profile](#personal-user-profile-my-profile).

<p align="center">
  <img src="readme_images\bookmarking.png" style="max-height: 50em; max-width: 50em"/>
</p>


## Main Searchbar

The main searchbar is accessible from anywhere on the website, and can look up posts based on their title or the [Keywords](#keywords) in the posts.


