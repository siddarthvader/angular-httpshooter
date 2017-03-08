# Angular-httpshooter
> A factory written in angular 1.0+ which makes/shoots all http calls collectively asynchronously.

Angular-httpshooter makes all your api calls asynchronous, idea behind it to make the connection between server and client single threaded, it means shooting only one call at a point of time and wait for the response from server to launch the next call.

> It blocks duplicate calls on the basis or either `url` or `data`, you can configure it according to your need.

It is based on `promise` chaining, it maintains a `queue` and push every call into it and then treat them on the basis of `FIFO`. it makes a promise for every `http` call and `reject`/`resolve` promise on the basis of response from server;

> Angular-httpshooter is here to provide enhanced support to maintain ACID property of DB.

Almost all new databases handle it on their level and serialize read/write calls using lock-based protocols and other measures, but it is always preferred that client handles the concurrency on its level.

>> NOTE: it will only matches the calls which are yet to take place, past calls are removed from queue as soon as the server returns response.


> ![Example network panel](http://i.imgur.com/7i9FSkZ.png)



## Features

* One api/server call in action at one point of time.
* it blocks duplicate server calls which generally happens when user press some button twice, read options for more details.
* 'timeout' defines the max-time wait limit, it server does not respond before timeout limit, it rejects the promise and you will get 599 status in error block.
* it releases two events on $rootScope `HTTP_CALL_STARTED` and `HTTP_CALL_STOPPED`, also sends config objects with events, you can catch this event and do many things. e.g. show loader or block UI from interaction.


## Use Angular-httpshooter in your webapp

install using npm
```bash
npm install angular-httpshooter --save
```

install using bower
```bash
bower install angular-httpshooter media-all --save
```

clone the git repo

```bash
git clone https://github.com/siddarthvader/angular-httpshooter.github
```

Once you have downloded the package you will have to inject the dependency in your angular app.

In your Module
````bash
    app.module('angularApp',['angular-httpshooter']);
````

In your Controller
````bash
    app.controller('appCtrl',['$httpshooter',function($httpshooter){

        $httpshooter.queue({
            method:'POST',
            url:'http://example.com/postData',
            data:data,
            headers:headers 
        },timeout).then(function(data){
            // if server returns success response
            console.log(data);// will be main response returned from server, stripped of all other data
        },function(data){
            // if server returns error response
        })

    }]);
````

Yes it is as simple as this.



## Options

Here are defaults values and possible values that can be passed to the factory for further processing.

````bash
| Property  |        Acceptable options       | Default options |
|-----------|---------------------------------|-----------------|
|  Method   |  get,post,delete,head,put,patch |        none     |
|  url      |            <string>             |        none     |
|  data     |            <object>             |        none     |
|  headers  |            <object>             |        none     |
|  timeout  |       time in miliseconds       |     36000ms     |

````

## Events
 

 ````bash
       $rootScope.$on('HTTP_CALL_STARTED', function (event,data) {
            console.log(data.url)  // url of http call in action
            console.log(data.data) // data of http call
            console.log(data.headers) // headers of http call

            // basically you get whole config object in here, including a promise
            // you can start a loader here, or freeze UI or can do anything
        });

        $rootScope.$on('HTTP_CALL_STOPPED', function (event,data) {
            // same data as above event

            // you can stop a loader here, or enable submit button or anything else
        });


 ````


## Customization

Here are the default values of params used in factory, you can configure them, like this:

````bash
app.config(function(shootConfig) {
  angular.extend(shootConfig, {
     defaultTimeOut:36000 // miliseconds
     blockDuplicateCalls: true,
     compareDuplicateParam:{
        url:true,
        data:false
    }
  });
})
````

* **defaultTimeOut** : default value 36000ms, you can change it if you want to.

* **blockDuplicateCalls** : default value `true`, change if you want to allow all calls to reach server.

* **compareDuplicateParam.url** : default value `true`, if `true` factory matches the calls on the basis of  `url` string.

* **compareDuplicateParam.data** : default value `false`, if `true` factory matches the calls on the basis on `data` object


## Licence

MIT

### Feel free to fork or report issues, I am here to help. \m/