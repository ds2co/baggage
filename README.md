# <span style="display:flex;height:75px;align-items: center;">![alt text](/logo/logo_60px.png)Baggage</span>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ds2co/baggage/blob/master/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/baggage.svg)](https://www.npmjs.com/package/baggage)
[![build status](https://img.shields.io/travis/ds2co/baggage/master.svg)](https://travis-ci.org/ds2co/baggage)
[![Github file size](https://img.shields.io/github/size/ds2co/baggage/baggage.min.js.svg)](https://github.com/ds2co/baggage/blob/master/dist/baggage.min.js)

Baggage is a fun, lightweight state container for JavaScript applications.

It helps you create consistency across your web applications and reduce the number of repetitive calls to the back-end. Just create a class and check it in at with the baggage handler. Baggage provides a selective level of data caching that can persist through page refresh and even the browser closing.

You can use Baggage together with React, Ember, Aurelia, Vue.js, or with any other view library.

It is tiny package (~2kB) and has no dependencies.

# Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
    - [Handler](#handler)
        - [.Check(class)](#handlercheckclass)
        - [.Check(class, level)](#handlercheckclass-level)
        - [.Claim()](#handlerclaim)
    - [Store Levels](#store-levels)
        - [CarryOn](#carryon)
        - [Checked](#checked)
        - [Excessive](#excessive)
- [Future Development](#future-development)

## Installation

```javascript
    npm install baggage --save 
```

## Basic Usage

### 1. Create a class
```javascript
    export default class ApplicationStore {
        constuctor() {
            this.username = null;
        }
    }
```

### 2. Check the class with the Baggage Handler on the entry file (example: app.js)
```javascript

    import { Handler } from 'baggage';
    import ApplicationStore from './ApplicationStore';

    Handler.Check(ApplicationStore);
```

### 3. Access the class from Baggage for future Read/Write operations
```javascript
    import { ApplicationStore } from 'baggage';

    ApplicationStore.username = 'gregg2';
```

## API Reference

### **Handler**

The Handler is used to manage the data that is being stored with Baggage.

```javascript
    import { Handler } from 'baggage';
    // - OR - //
    const { Handler } = require('baggage');
    // - OR - //
    var baggageHandler = require('baggage').Handler;
```

Functions: 

#### `Handler.Check(class)`

Adds class to the store at the lowest level store cache (aka CarryOn).

#### `Handler.Check(class, level)`

Adds class to the store at the store level passed into the function.

#### `Handler.Claim()`

Removes all registed classes. This function is good to use on logout or if all data needs to be reset in an application. 


### **Store Levels**

#### `CarryOn`
- Level 1 Store.
- Data persists until tab/window is refreshed, closed, or Handler.Claim() is executed.

```javascript
    import { CarryOn } from 'baggage';
    // - OR - //
    const { CarryOn } = require('baggage');
    // - OR - //
    var level = require('baggage').CarryOn;
```

#### `Checked`
- Level 2 Store.
- Data persists until tab/window is closed or Handler.Claim() is executed.

```javascript
    import { Checked } from 'baggage';
    // - OR - //
    const { Checked } = require('baggage');
    // - OR - //
    var level = require('baggage').Checked;
```

#### `Excessive`
- Level 3 Store.
- Data persists until Handler.Claim() is executed.

```javascript
    import { Excessive } from 'baggage';
    // - OR - //
    const { Excessive } = require('baggage');
    // - OR - //
    var level = require('baggage').Excessive;
```

## Future Development
- Baggage for React-Native Apps.
- Baggage package that has security in mind.  

## Todo List
- Create extensive API documentation.
- Add a CONTRIBUTING guide.