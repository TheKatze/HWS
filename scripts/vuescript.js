//Routing

var app;
var homeworkId;

window.onload = function() {
    const Dashboard = {
        template: "#dashboard"
    };
    const Homeworks = {
        template: "#homeworks"
    }
    const Classes = {
        template: "#classes"
    }
    const Leaderboards = {
        template: "#leaderboards"
    }
    const Profile = {
        template: "#profile"
    }
    const Menu = {
        template: "#menu"
    }
    const Login = {
        template: "#loginview"
    }
    const PasswordReset = {
        template: "#passwordreset"
    }
    const Register = {
        template: "#register"
    }
    const NotFound = {
        template: "#notfound"
    }
    const Homework = {
        template: "#homework"
    }


    const routes = [{
            path: '/404',
            component: NotFound
        },

        {
            path: '/app/',
            component: Menu,
            children: [{
                    path: 'dashboard',
                    component: Dashboard
                },
                {
                    path: '',
                    redirect: 'dashboard'
                },
                {
                    path: 'homeworks',
                    component: Homeworks
                },
                {
                    path: 'classes',
                    component: Classes
                },
                {
                    path: 'leaderboards',
                    component: Leaderboards
                },
                {
                    path: 'profile',
                    component: Profile
                },
                {
                    path: 'homework',
                    component: Homework
                }
            ]
        },

        {
            path: '/login',
            component: Login
        },

        {
            path: '',
            redirect: 'login'
        },

        {
            path: '/resetpassword',
            component: PasswordReset
        },

        {
            path: '/register',
            component: Register
        },

        {
            path: '/*',
            redirect: '404'
        }


    ]

    const router = new VueRouter({
        routes
    })

    app = new Vue({
        router,

        http: {
            root: '/'
        },

        ready() {
            window.addEventListener('onload', this.reload());
        },

        methods: {
            reload() {
                console.log(this._router.currentRoute.path.split('/')[1]);
                this.updateData(this._router.currentRoute.path.split('/')[2]);

            },

            updateData(route) {

                if (this._router.currentRoute.path.split('/')[1] == "app") {
                    if (readCookies('cookiezi')) {
                        switch (route) {
                            case 'dashboard':
                                startLoad();
                                Vue.http.post('php/update_dashboard.php', {}).then(response => {
                                    finishLoad();
                                    let responseCode = JSON.parse(response.body);
                                    switch (responseCode.response) {
                                        case 0:
                                            document.getElementById('dashboardUsername').innerText = responseCode.user.name;
                                            document.getElementById('dashboardOpenHomeworks').innerText = responseCode.user.openHomeworks;
                                            document.getElementById('dashboardDollaz').innerText = responseCode.user.dollaz;
                                            document.getElementById('dashboardRespect').innerText = responseCode.user.respect;


                                            if ((!(responseCode.nextHomework.name === null) && !(responseCode.nextHomework.id == 0)) && document.getElementById('nextHomework') == null) {
                                                document.getElementById('dashboardContainer').insertAdjacentHTML('beforeend', '<div class="card" id="nextHomework"> <h1>Next Homework</h1> <b class="importantNumber">' + responseCode.nextHomework.name + '</b> <b>' + responseCode.nextHomework.class + '</b> <span>' + responseCode.nextHomework.date + '</span> </div>');
                                            }

                                            break;
                                        case 10:
                                            console.log("fail");
                                            break;
                                        case 12:
                                        default:
                                            app._router.push('/login');
                                            break;
                                    }
                                }, response => {

                                });
                                break;
                            case 'homeworks':
                                startLoad();
                                Vue.http.post('php/update_homeworks.php', {}).then(response => {
                                    finishLoad();
                                    let responseCode = JSON.parse(response.body);
                                    switch (responseCode.response) {
                                        case 0:
                                            var myNode = document.getElementById("homeworksContainer");
                                            while (myNode.firstChild) {
                                                if (myNode.firstChild.classList.contains("card")) {
                                                    myNode.removeChild(myNode.firstChild);
                                                } else {
                                                    break;
                                                }
                                            }
                                            for (var i in responseCode.homeworks) {
                                                var homework = responseCode.homeworks[i];
                                                document.getElementById('homeworksContainer').insertAdjacentHTML('afterbegin', '<div id="homework_'+ homework.id +'" class="card" onclick="javascript:homeworkRoute(' + homework.id + ');"><h1>'+ homework.name +'</h1><h1>'+ homework.class +'</h1><span>Until '+ homework.date +'</span></div>');
                                            }
                                            break;
                                        case 10:
                                            console.log("fail");
                                            break;
                                        case 12:
                                        default:
                                            app._router.push('/login');
                                            break;
                                    }
                                    finishLoad();
                                }, response => {

                                });
                                break;
                            case 'classes':
                                startLoad();
                                Vue.http.post('php/update_classes.php', {}).then(response => {
                                    finishLoad();
                                    let responseCode = JSON.parse(response.body);
                                    switch (responseCode.response) {
                                        case 0:
                                            var myNode = document.getElementById("classesContainer");
                                            while (myNode.firstChild) {
                                                if (myNode.firstChild.classList.contains("card")) {
                                                    myNode.removeChild(myNode.firstChild);
                                                } else {
                                                    break;
                                                }
                                            }
                                            for (var i in responseCode.classes) {
                                                var clas = responseCode.classes[i];
                                                var status;
                                                switch (clas.status) {
                                                    case 0:
                                                        status = '<span>Congratulations: You broke it!<span>';
                                                        break;
                                                    case 1:
                                                        status = '<span>Student<span><button type="button" name="button" onclick="javascript:classNormInfoPopUp('+ clas.id +');">Info</button>';
                                                        break;
                                                    case 2:
                                                        status = '<span>Invited<span><button type="button" name="button" onclick="javascript:classInvAcc('+ clas.id +');">Accept</button><button class="buttonInCard" type="button" name="button" onclick="javascript:classInvDec('+ clas.id +');">Decline</button>';
                                                        break;
                                                    case 3:
                                                        status = '<span>Class Representative</span><button type="button" name="button" onclick="javascript:classRepInfoPopUp('+ clas.id +');">Manage</button>';
                                                        break;
                                                    default:
                                                        status = '<span>Congratulations: You really broke it!<span>';
                                                }

                                                document.getElementById('classesContainer').insertAdjacentHTML('afterbegin', '<div id="class_'+ clas.id +'" class="card"><h1>'+ clas.name +'</h1>' + status +'</div>');
                                            }
                                            break;
                                        case 10:
                                            console.log("fail");
                                            break;
                                        case 12:
                                        default:
                                            app._router.push('/login');
                                            break;
                                    }
                                    finishLoad();
                                }, response => {
                                    console.log("Sometings very wroing");
                                });
                                break;
                            case 'profile':
                                startLoad();
                                Vue.http.post('php/update_profile.php', {}).then(response => {
                                    finishLoad();
                                    let responseCode = JSON.parse(response.body);
                                    switch (responseCode.response) {
                                        case 0:
                                            document.getElementById('profileUsername').innerText = responseCode.user.name;
                                            document.getElementById('profileDate').innerText = responseCode.user.timestamp;
                                            document.getElementById('profileDollaz').innerText = responseCode.user.dollaz;
                                            document.getElementById('profileRespect').innerText = responseCode.user.respect;
                                            document.getElementById('profileEmail').innerText = responseCode.user.email;
                                        break;
                                        case 10:
                                            console.log("fail");
                                            break;
                                        case 12:
                                        default:
                                            app._router.push('/login');
                                            break;
                                    }
                                    finishLoad();
                                }, response => {

                                });
                                break;
                            case 'homework':
                                startLoad();
                                Vue.http.post('php/update_uploads.php', {
                                    h: homeworkId
                                }).then(response => {
                                    finishLoad();
                                    let responseCode = JSON.parse(response.body);
                                    switch (responseCode.response) {
                                        case 0:
                                            var myNode = document.getElementById("homeworkContainer");
                                            while (myNode.firstChild) {
                                                if (myNode.firstChild.classList.contains("card")) {
                                                    myNode.removeChild(myNode.firstChild);
                                                } else {
                                                    break;
                                                }
                                            }
                                            try {
                                                if (responseCode.uploads[0].id >= 0) {
                                                    for (i of responseCode.uploads) {
                                                        if (i.bought == 1) {
                                                            document.getElementById('homeworkContainer').insertAdjacentHTML('afterbegin', '<div id="upload_'+ i.id +'" class="card"><h1>'+ i.description +'</h1><span>Respect: '+ i.respect +'</span><span>Dollaz: '+ i.dollaz +'</span><span>Uploaded: '+ i.timestamp +'</span><button type="button" name="button" onclick="javascript:downloadUpload(' + i.id + ');">Download</button></div>');
                                                        } else {
                                                            document.getElementById('homeworkContainer').insertAdjacentHTML('afterbegin', '<div id="upload_'+ i.id +'" class="card"><h1>'+ i.description +'</h1><span>Respect: '+ i.respect +'</span><span>Dollaz: '+ i.dollaz +'</span><span>Uploaded: '+ i.timestamp +'</span><button type="button" name="button" onclick="javascript:buyUpload(' + i.id + ');">Buy</button></div>');
                                                        }
                                                    }
                                                }
                                            } catch (e) {
                                                console.log(e);
                                                document.getElementById('homeworkContainer').insertAdjacentHTML('afterbegin', '<div class="card"><h1>No Uploads Yet</h1></div>');
                                            }
                                        break;
                                        case 10:
                                            console.log("fail");
                                            break;
                                        case 12:
                                        default:
                                            app._router.push('/login');
                                            break;
                                    }
                                    finishLoad();
                                }, response => {

                                });
                                break;
                            default:
                                //app._router.push('/login');
                                break;

                        }
                    } else {
                        app._router.push('/login');
                    }
                }
            }
        },

        watch: {
            '_route': function(newRoute, oldRoute) {
                this.updateData(newRoute.path.split('/')[2]);
            }
        }

    }).$mount('#app');

    if (readCookies('cookiezi')) {
        app._router.push('/app');
    }
    app.reload();
}

function downloadUpload(id) {
    window.location = 'php/download_file.php?id=' + id;
}

function buyUpload(uid) {

    let uploadId = uid;
    startLoad();
    Vue.http.post('php/insert_buy_upload.php', {
        u: uploadId
    }).then(response => {
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Successfully bought an Upload");
                app.reload();
                break;
            case 10:
                console.log("Error");
                console.log(responseCode.error);
                break;
            case 11:
                console.log("Sql Fail");
                console.log(responseCode.error);
                break;
            case 12:
                app._router.push('/app');
                console.log("Not Logged in");
                break;
                //Any other code: wtf
            default:
                console.log("WTF, Login returned invalid response code.");
        }


    }, response => {
        console.log("Failed to reach server.");
        console.log(response);
    });
}

function homeworkRoute(id) {
    app._router.push('/app/homework');
    if (homeworkId != id) {
        homeworkId = id;
    }
}

//Login

function login() {

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (username == "" || password == "") {
        return;
    }
    Vue.http.post('php/login.php', {
        u: username,
        pw: password
    }).then(response => {
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Successfully logged in as " + username);

                console.log(readCookies('cookiezi'));
                app._router.push('/app');
                break;
                //Code 10: Wrong Password
            case 10:
                console.log("Wrong Password");
                break;
                //Code 11: MySQL Error
            case 11:

                break;
                //Any other code: wtf
            default:
                console.log("WTF, Login returned invalid response code.");
        }


    }, response => {
        console.log("Failed to reach server.");
    });
}

function signup() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;

    if (username == "" || password == "" || email == "") {
        return;
    }
    Vue.http.post('php/register_user.php', {
        u: username,
        pw: password,
        e: email
    }).then(response => {
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }


    }, response => {
        console.log("Failed to reach server.");
    });

}

function logout() {
    startLoad();
    Vue.http.post('php/logout.php', {}).then(response => {
        finishLoad();
        document.cookie = 'cookiezi' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        app._router.push('/login');
    });
}

function addHomeworkPopUp() {
    document.getElementById('popUp').classList.remove("hidden");
    document.getElementById('homeworkPopUp').classList.remove("hidden");

    var myNode = document.getElementById("addHomeworkClass");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    startLoad();
    Vue.http.post('php/update_classes.php', {}).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, you got your dropdown options created");
                for (var i in responseCode.classes) {
                    var clas = responseCode.classes[i];
                    document.getElementById('addHomeworkClass').insertAdjacentHTML('afterbegin', '<option value="' + clas.id + '">' + clas.name + '</option>');
                }
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}
function addHomework() {
    let classId = document.getElementById('addHomeworkClass').value;
    let name = document.getElementById('addHomeworkName').value;
    let date = document.getElementById('addHomeworkDate').value;
    startLoad();
    Vue.http.post('php/insert_homework.php', {
        c: classId,
        n: name,
        d: date,
    }).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, Homework created");
                popDown();
                app.reload();
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}

function addClassPopUp() {
    document.getElementById('popUp').classList.remove("hidden");
    document.getElementById('classPopUp').classList.remove("hidden");
}

function addUploadPopUp() {
    document.getElementById('popUp').classList.remove("hidden");
    document.getElementById('uploadPopUp').classList.remove("hidden");

    var element = document.getElementById('uploadFormClass');
    if (!(element === null)) {
        element.parentNode.removeChild(element);
    }
    document.getElementById('uploadForm').insertAdjacentHTML('beforeend', '<input id="uploadFormClass" type="hidden" name="homework" value="' + homeworkId + '" />');
}

function addUpload() {
    let file = document.getElementById('uploadFile').files[0];

    var reader = new FileReader();

    reader.onload = (e) => {
        sendUpload(e.target.result);
    };

    reader.readAsText(file);
}
function sendUpload(fileData) {
    let respect = document.getElementById('uploadRespect').value;
    let dollaz = document.getElementById('uploadDollaz').value;
    let description = document.getElementById('uploadDescription').value;
    let file = document.getElementById('uploadFile').files[0];
    startLoad();
    Vue.http.post('php/insert_upload.php', {
        r: respect,
        d: dollaz,
        n: description,
        h: homeworkId,
        f_name: file['name'],
        f_size: file['size'],
        f_type: file['type'],
        f_data: fileData
    }).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, Upload created");
                popDown();
                app.reload();
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log('There was an Error:');
                console.log(responseCode.error);
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}

function addClass() {
    let name = document.getElementById('addClassName').value;
    startLoad();
    Vue.http.post('php/insert_class.php', {
        n: name
    }).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, Class created");
                popDown();
                app.reload();
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}

function classRepInfoPopUp(classId) {
    var myNode = document.getElementById("classMembers");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    startLoad();
    Vue.http.post('php/update_class_members.php', {
        c: classId
    }).then(response =>{
        finishLoad();
        let responseFull = JSON.parse(response.body);

        responseCode = responseFull.response;
        switch (responseCode) {
            //Code 00: Success
            case 0:
                console.log("Success, You got mail");

                var myNode = document.getElementById("classMembersNorm");
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

                document.getElementById('popUp').classList.remove("hidden");
                document.getElementById('classRepInfoPopUp').classList.remove("hidden");
                document.getElementById('classMembers').insertAdjacentHTML('beforeend', '<p id="classIdSave" class="hidden">' + classId + '</p>');

                for (i of responseFull.class_members) {
                    console.log(i);
                    document.getElementById('classMembers').insertAdjacentHTML('beforeend', '<div><span>' + i + '</span></div>');
                }
                // TODO: Make that the Classmebmers are variablete

                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })

}

function classNormInfoPopUp(classId) {
    var myNode = document.getElementById("classMembersNorm");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    startLoad();
    Vue.http.post('php/update_class_members.php', {
        c: classId
    }).then(response =>{
        finishLoad();
        let responseFull = JSON.parse(response.body);

        responseCode = responseFull.response;
        switch (responseCode) {
            //Code 00: Success
            case 0:
                console.log("Success, You got mail");

                var myNode = document.getElementById("classMembersNorm");
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

                document.getElementById('popUp').classList.remove("hidden");
                document.getElementById('classNormInfoPopUp').classList.remove("hidden");
                document.getElementById('classMembersNorm').insertAdjacentHTML('beforeend', '<p id="classIdSave" class="hidden">' + classId + '</p>');

                for (i of responseFull.class_members) {
                    console.log(i);
                    document.getElementById('classMembersNorm').insertAdjacentHTML('beforeend', '<div><span>' + i + '</span></div>');
                }
                // TODO: Make that the Classmebmers are variable

                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })


}

function classInvAcc(classId) {
    startLoad();
    Vue.http.post('php/invite_accept.php', {
        c: classId
    }).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, Invite accepted");
                app.reload();
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}

function classInvDec(classId) {
    startLoad();
    Vue.http.post('php/invite_decline.php', {
        c: classId
    }).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, Invite declined");
                app.reload();
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}

function inviteToClass() {
    let username = document.getElementById('inviteUserName').value;
    let classId = document.getElementById('classIdSave').innerText;
    startLoad();
    Vue.http.post('php/insert_invite.php', {
        u: username,
        c: classId
    }).then(response =>{
        finishLoad();
        let responseCode = JSON.parse(response.body);

        switch (responseCode.response) {
            //Code 00: Success
            case 0:
                console.log("Success, User invited");
                popDown();
                app.reload();
                break;
            case 12:
                app._router.push('/login');
                break;
            default:
                console.log("WTF, Login returned invalid response code.");
        }
    }, response => {
        console.log("Failed to reach server.");
    })
}

function popDown() {
    var elements = document.getElementsByClassName('popUp');
    var i;
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add("hidden");
    }
}

function passwordReset() {
    let email = document.getElementsById('email').value;
    //Vue.http.post('php/resetPassword.php')
}

//Adds the .hidden class to the loading screen
function startLoad() {
    document.getElementById('cssloadContainer').classList.remove("hidden");
}

//Removes the .hidden class from the loading screen
function finishLoad() {
    document.getElementById('cssloadContainer').classList.add("hidden");
}

//Does Cookie stuff
function readCookies(n) {
    var a = document.cookie.split('; ');
    for (var i = 0; i < a.length; i++) {
        var C = a[i].split('=');
        if (C[0] == n) {
            return C[1];
        }
    }
}
