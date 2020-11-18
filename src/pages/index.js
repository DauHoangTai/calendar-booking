import React, { useState, useRef, useEffect } from 'react';
import CalendarForm from 'react-calendar';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { PopupboxManager } from 'react-popupbox';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment);
const shortid = require('shortid');




const firebaseConfig = {
    apiKey: "AIzaSyAXNO91O0Sy0VzxRzwYFzhQoeKcGlfr2TI",
    authDomain: "calendar-booking-93bc5.firebaseapp.com",
    databaseURL: "https://calendar-booking-93bc5.firebaseio.com",
    projectId: "calendar-booking-93bc5",
    storageBucket: "calendar-booking-93bc5.appspot.com",
    messagingSenderId: "516107102575",
    appId: "1:516107102575:web:8f4a55fa4f3c345a94e09a",
    measurementId: "G-JE951H1WVN"
};

var Firebase = null;

const IndexPage = () => {

    const dispatch = useDispatch();

    const useComponentWillMount = (func) => {
        const willMount = useRef(true)
        if (willMount.current) func()
        willMount.current = false
    }

    const [_connectFirebase, set_connectFirebase] = useState(false);
    const [_listRinse, set_listRinse] = useState([]);
    const [_form, set_form] = useState("");
    const [_calendar, set_calendar] = useState("");
    const [_statusForm, set_statusForm] = useState(false);
    const [value, setValue] = useState(new Date());

    const [_events, set_events] = useState( []);

    const fire = () => {
        if (!firebase.apps.length) {
            Firebase = firebase.initializeApp(firebaseConfig);
            set_connectFirebase(true);
            Firebase.database().ref('/rinseDB').once('value').then((data) => {
                // console.log(data.val());
                if (data.val()) {
                    var temp = handleDataFirebase(data.val());
                    set_listRinse(temp);
                    // console.log(handleDataFirebase(data.val()));
                    setupEvents(temp);
                }
            })
        }
    }

    useEffect(() => {
        if (Firebase == null) {
            fire();
        }
    })


    useComponentWillMount(() => {
        var d = new Date();
        set_calendar(d.getTime() / 1000);
    })

    // const getListRinse = () => {
    //     if (Firebase != null) {
    //         Firebase.database().ref('/rinseDB').on('value', (data) => {
    //             set_listRinse(data.val().filter(item => item != null && item != undefined));
    //         })
    //     }
    // }

    const handleDataFirebase = (data) => {
        var nameObject = Object.getOwnPropertyNames(data);
        var temp = [];
        nameObject.forEach((value, index) => {
            temp.push(data[value]);
        })
        return temp;
    }

    const convertEpochToText = (epoch) => {
        var d = new Date(epoch * 1000);
        var month = d.getMonth() + 1;
        return d.getDate() + "/" + month + "/" + d.getFullYear();
    }

    // const convertEpochToText_2 = (epoch) => {
    //     var d = new Date(epoch * 1000);
    //     var month = d.getMonth() + 1;
    //     return d.getDate() + month + d.getFullYear();
    // }

    const handleform = (e) => {
        var form = { ..._form };
        form[e.target.name] = e.target.value;
        set_form(form);
    }

    const setupEvents = (data) => {
        var events = [];
        data.forEach(value => {
            events.push({ start: new Date(value.calendar*1000), end: new Date(value.calendar*1000), title: value.fullname });
        })
        set_events(events);
    }

    const registerForm = (e) => {
        e.preventDefault();
        var temp = _listRinse.filter(item => convertEpochToText(item.calendar) == convertEpochToText(value.getTime() / 1000));

        var data = {
            id: shortid.generate(),
            fullname: _form.fullname,
            password: _form.password,
            calendar: _calendar,
            index: temp.length + 1
        }

        if (data.fullname.length > 0 && data.password.length > 0) {
            Firebase.database().ref('/rinseDB/' + data.id).set(data);
            dispatch({ type: "ALERT_SUCCESS", msg: "Đăng ký thàng công" });
            var temp = [..._listRinse];
            temp.push(data);
            set_listRinse(temp);
            // console.log(data);
            set_statusForm(false);
            setupEvents(temp);
        
        }
        else {
            dispatch({ type: "ALERT_ERROR", msg: "Đăng ký thất bại" });
        }

    }

    const remove = (id, password) => {
        var inputText = "";
        const confirmRemove = () => {
            if (password == inputText.trim()) {
                Firebase.database().ref('/rinseDB/' + id).remove();
                PopupboxManager.close();
                dispatch({ type: "ALERT_SUCCESS", msg: "Xóa thành công" });
                var temp = _listRinse.filter(item => item.id != id);
                set_listRinse(temp);
                setupEvents(temp);

            }
            else {
                dispatch({ type: "ALERT_ERROR", msg: "Mật khẩu sai" })
            }

        }
        const content = (
            <div>
                <form>
                    <div className="form-group">
                        <label className="d-block">Nhập mật khẩu</label>
                        <input type="text" className="form-control" onChange={(e) => { inputText = e.target.value; }} />
                        <button onClick={() => confirmRemove()} type="button" class="btn btn-danger mt-3 btn-block">Xác nhận</button>
                    </div>
                </form>

            </div>
        )
        PopupboxManager.open({
            content,
            config: {
                titleBar: {
                    enable: true,
                    text: 'Meow!'
                },
                fadeIn: true,
                fadeInSpeed: 500
            }
        })
    }

    const displayTable = () => {
        var list = _listRinse.filter(item => convertEpochToText(item.calendar) == convertEpochToText(value.getTime() / 1000));
        list.sort(function (a, b) { return a.index - b.index });
        return (
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Danh tính</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index}</th>
                                    <td>{value.fullname}</td>
                                    <td onClick={() => remove(value.id, value.password)} className="text-center remove-icon" style={{ cursor: 'pointer' }}><i className="fa fa-trash text-white" aria-hidden="true"></i></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }

    const displayForm = () => {
        return (
            <form onSubmit={(e) => registerForm(e)}>
                <div className="form-group">
                    <label>Xưng danh</label>
                    <input onChange={(e) => handleform(e)} type="text" className="form-control" name="fullname" placeholder="Điền danh tính vào đây" />
                </div>
                <div className="form-group">
                    <label>Chọn ngày</label>
                    <input disabled type="text" className="form-control" name="time" placeholder={convertEpochToText(_calendar)} />
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input onChange={(e) => handleform(e)} type="password" className="form-control" name="password" placeholder="Điền mật khẩu vào đây" />
                </div>
                <div className="form-group d-flex justify-content-center align-items-center">
                    <button type="submit" className="btn btn-success btn-block">Xác nhận</button>
                </div>
            </form>
        )
    }

    return (
        <>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-3 text-center">Đăng ký phơi đồ</h1>
                    {/* <p className="lead">Jumbo helper text</p> */}
                    <hr className="my-2" />
                </div>
            </div>

            <div className="calendar-main">
                <div className="container">
                    <Calendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="month"
                        events={_events}
                        style={{ height: "100vh" }}
                    />
                    <div className="row mt-5">
                        <div className="col-lg-6 d-flex justify-content-center align-items-center">
                            <div className="d-flex">
                                <CalendarForm
                                    value={value}
                                    onChange={(value) => { var d = new Date(value); set_calendar(d.getTime() / 1000); setValue(value) }}

                                />
                            </div>
                        </div>
                        <div className="col-lg-6 mt-4 mt-lg-10">
                            <div className="form-group d-flex align-items-center">
                                <button onClick={() => set_statusForm(false)} type="button" className="btn btn-primary mr-3 btn-block">Xem kết quả</button>
                                <button onClick={() => set_statusForm(true)} type="button" className="btn btn-success m-0 btn-block">Đăng ký</button>
                            </div>
                            {_statusForm == false ? displayTable() : displayForm()}
                        </div>
                    </div>
                </div>

            </div>
            <style jsx>{`
                .calendar-main{
                    display: flex;
                    margin-top: 50px;
                    align-items: center;
                    justify-content: center;
                }
               
            `}</style>
        </>
    );
}

export default IndexPage;