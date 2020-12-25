const url = 'https://localhost:5001/api/User';
const uri = 'https://localhost:5001/api/Register';
const urls = 'https://localhost:5001/api/Personal';
const url1 = 'https://localhost:5001/api/PostPersonal';

function Register() {
    const userName = document.getElementById('UserName').value;
    const passWord = document.getElementById('PassWord').value;
    const cpassWord = document.getElementById('CpassWord').value;
    const item = {
        UserName: userName.trim(),
        PassWord: passWord.trim(),
        CpassWord: cpassWord.trim()
    };
    if (userName == "") {
        alert("用户名不能为空");
        return;
    }
    if (passWord == "") {
        alert("密码不能为空");
        return;
    }
    if (cpassWord != passWord) {
        alert("二次密码不一致，请重新输入");
        return;
    }

    fetch(uri, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })

        .then(response => {
            response.json();
            alert("注册成功");
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Unable to add item.', error))
        .then(response => console.log('Success', response));
}

function login() {
    const userName = document.getElementById('UserName').value;
    const passWord = document.getElementById('PassWord').value;

    const item = {

        UserName: userName.trim(),
        PassWord: passWord.trim()
    };
    if (userName == "") {
        alert("用户名不能为空");
        return;
    }
    if (passWord == "") {
        alert("密码不能为空");
        return;
    }
    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            alert("登录成功！");
            window.location.href = 'personal.html' + '?id=' + data.id;
        })

}
function i() {
    var sf = 'https://localhost:5001/api/Province';
    fetch(sf, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data);
            var province = document.getElementById('Provinces');
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    //  var sfid=province.options.add(new Option(data[i].name))
                    var op = new Option(data[i].name, data[i].id)
                    province.options.add(op);
                }

            }
            var city = 'https://localhost:5001/api/City';

            province.onchange = function () {

                var index = province.selectedIndex;
                var value = province.options[index].value;
                fetch(city + '?parentid=' + value, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        console.log(data);
                        var cities = document.getElementById('City')
                        if (cities.value != "") {
                            cities.innerHTML = "";
                        }
                        if (data != null) {
                            for (var i = 0; i < data.length; i++) {
                                var op = new Option(data[i].name, data[i].id)
                                cities.options.add(op);
                            }

                        }
                    })
            }

        })
}

function GetPersonal(id) {
    var str = location.href;
    var urlinfo = window.location.href;  //获取当前页面的url
    console.log(urlinfo)
    var len = urlinfo.split("?");//获取url的长度
    newsidinfo = len[1];
    console.log(newsidinfo);
    var newsids = newsidinfo.split("&");//对获得的参数字符串按照“=”进行分割
    parameter1 = newsids[0];
    os = parameter1.split("=")[1];
    fetch(urls + '?id=' + os, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((res) => {
            return res.json()
        })
        .then((datas) => {
            console.log(datas);
            document.getElementById('Id').value = datas.id;
            document.getElementById('UserName').value = datas.userName;
            document.getElementById('PassWord').value = datas.passWord;
            document.getElementById('Provinces').value = datas.provinces;
            document.getElementById('City').value = datas.city;
            document.getElementById('Url').value = datas.url;
            document.getElementById('img').src = datas.fileUrl;
            if (datas.gender == "男") {
                document.getElementById('Gender1').checked = true;
            }
            if (datas.gender == "女") {
                document.getElementById('Gender2').checked = true;
            }
            document.getElementById('Age').value = datas.age;

            var imgBox = document.getElementById('Image');
            imgBox.addEventListener("change", function () {
                //FileReader可以获取文件中的数据
                var reader = new FileReader();
                //获取文件内容以url形式表示
                reader.readAsDataURL(imgBox.files[0]);
                reader.onload = function () {
                    //赋值给img
                    img.src = this.result
                }
            })

            if (datas.provinces != "0") {
                var sf = 'https://localhost:5001/api/Province';
                var pro = datas.provinces;
                fetch(sf, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        console.log(data);
                        var province = document.getElementById('Provinces');
                        if (data != null) {
                            for (var i = 0; i < data.length; i++) {
                                var city = data[i].id;
                                var opt = document.createElement("option");
                                opt.value = data[i].id;
                                opt.text = data[i].name;

                                if (city == pro) {
                                    opt.setAttribute("selected", true);
                                    province.appendChild(opt);
                                }
                            }

                        }
                    })
            }
            if (datas.city != "0") {
                var cityurl = 'https://localhost:5001/api/City';
                var province = document.getElementById('Provinces');
                var index = province.selectedIndex;
                var value = province.options[index].value;
                var cit = datas.city;

                fetch(cityurl + '?parentid=' + value, {

                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        console.log(data);
                        var cities = document.getElementById('City');

                        if (cities.value != "") {
                            cities.innerHTML = "";
                        }
                        if (data != null) {
                            // for (var i = 0; i < data.length; i++) {
                            //     var op = new Option(data[i].name, data[i].id)
                            //     cities.options.add(op);
                            // }
                            for (var i = 0; i < data.length; i++) {
                                var city = data[i].id;
                                var opt = document.createElement("option");
                                opt.value = data[i].id;
                                opt.text = data[i].name;

                                if (city == cit) {
                                    opt.setAttribute("selected", true);
                                    cities.appendChild(opt);
                                }

                            }
                        }
                    })
            }


        })
}


function Personal() {
    var imgBox = document.getElementById('Image').value;
    var imgBoxs = document.getElementById('Image');
    var img = document.getElementById('img');
    const id = document.getElementById('Id').value;
    const userName = document.getElementById('UserName');
    const passWord = document.getElementById('PassWord');
    const age = document.getElementById('Age');
    const provinves = document.getElementById('Provinces');
    const city = document.getElementById('City');
    const url = document.getElementById('Url');

    var radios = document.getElementsByName("loan");
    var reader = new FileReader();
    if (imgBox != "") {
        reader.readAsDataURL(imgBoxs.files[0]);
        reader.onload = function () {
            img.src = this.result
        }
    }

    var value = 0;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {
            value = radios[i].value;
        }
    }
    if (age.value < 2 || age.value > 120 || isNaN(age.value) == true) {
        alert("输入年龄格式不正确！请重新输入");
        return;
    }
    var reg = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
    if (!reg.test(url.value)) {
        alert("网址不正确哦,请重新输入");
        return;
    }

    var index = provinves.selectedIndex;
    var Pvalue = provinves.options[index].value;
    var cindex = city.selectedIndex;
    var Cvalue = city.options[cindex].value;
    const item = {
        Id: parseInt(id, 10),
        UserName: userName.value.trim(),
        PassWord: passWord.value.trim(),
        Gender: value,
        Age: age.value.trim(),
        Province: Pvalue,
        City: Cvalue,
        Url: url.value.trim(),
        Image: img.src
    };
    fetch(url1 + "?id="+id, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
    })


        .then(response => {
            response.json();
            alert("修改成功！");
        })

        .then((datas) => {
            console.log(datas);
        })
        .catch(error => console.error('Unable to add item.', error))
        .then(response => console.log('Success', response))

}


