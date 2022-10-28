const app = Vue.createApp({
    data() {
        return {
            company: 'Saudi National Bank',
            api: 'https://script.google.com/macros/s/AKfycbx675PRlND1p7OWnjXTlMqHO6TW69ARIaU0ooFSLdpAqQfPf8ggrsL6oPnzFtlXR7GMKA/exec',
            loged: false,
            logedIn: false,
            openCamera: false,
            preview: false,
            username: '',
            useremail: '',
            usernumber: '',
            imageURI: '',
            terms: false,
            editTools: true,
            spinner: false,
            dir: 'rtl',
            lang: 'arb',
            count: ''

        }
    },
    mounted() {
        var swiper = new Swiper('.swiper', {
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    },
    methods: {

        getCred(e) {
            console.log(e)
            this.username = e.name
            this.useremail = e.email
            this.usernumber = e.number

            this.startWebcam()
        },

        setLang(lang) {
            this.lang = lang
            if (this.lang == 'arb') this.dir = 'rtl'
            else this.dir = 'ltr'
        },

        trancate(text, size) {
            // it trancate n number of words
            // var n = 20
            // var text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non neque nesciunt et. Exercitationem quam corrupti officia expedita aspernatur eveniet fugiat repudiandae quos? Harum omnis molestias eos quia, in illum incidunt exercitationem, enim possimus quasi laboriosam ut! Alias provident consequatur dicta.'
            // console.log(text.split(' ',20))
            if (text.split(' ').length < size) return text
            else {

                var words = text.split(' ', size)
                var trancatedText = ''
                words.forEach(word => {
                    trancatedText += word + ' '
                })
                trancatedText += ' ...'
                // console.log(trancatedText)
                return trancatedText
            }
        },

        isArabic(text) {
            var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
            result = pattern.test(text);
            return result;
        },
        isEng(text) {

            var pattern = /[A-z]/gi;
            result = pattern.test(text);
            return result;
        },
        isRus(text) {

            var pattern = /[\u0400-\u04FF]/gi;
            result = pattern.test(text);
            return result;
        },
        tarjem(text, lang) {

            var res;
            // var lang = 'arb'
            // console.log('tarjem')
            // var text = `привет e ;; hello world ;; e السلام عليكم `
            if (lang == 'arb') {
                var demo = text.split(';;')
                demo.forEach(e => {
                    if (this.isArabic(e)) res = e
                })
            } else {
                if (lang == 'eng') {

                    var demo = text.split(';;')
                    demo.forEach(e => {
                        if (this.isEng(e)) res = e
                    })
                } else {
                    if (lang == 'rus') {

                        var demo = text.split(';;')
                        demo.forEach(e => {
                            if (this.isRus(e)) res = e
                        })
                    }
                }
            }
            return res
        },
        share() {
            this.spinner = true
            fetch(this.api, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify({
                    name: this.username,
                    email: this.useremail,
                    number: this.usernumber,
                    imageURI: this.imageURI

                })
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res == "200") {
                        alert('تم ارسال الصور بنجاح ، الرجاء التحقق من بريدك')
                        this.spinner = false;
                        location.reload()
                    } else {
                        alert('Invalid Email Address')
                        this.spinner = false;
                        location.reload()
                    }
                }).catch(e => {
                    alert('شبكة ضعيفة الرجاء المحاولة مجددا')
                    console.log(e)

                    this.spinner = false;
                    location.reload()
                })


        },
        async print() {
            this.editTools = !this.editTools
            await window.print()

            location.reload()
            // this.share()
        },
        focus() {
            document.querySelector('.inp').blur()
        },
        async startCounter() {

            this.count = 5

            var INV = setInterval(() => {
                if (this.count == 1) { ; clearInterval(INV); this.capture() }
                this.count--;
            }, 1000)
        },
        capture() {
            // preload shutter audio clip

            var shutter = new Audio();
            shutter.autoplay = true;
            shutter.src = navigator.userAgent.match(/Firefox/) ? 'shutter.ogg' : './assets/shutter.mp3';

            // play sound effect
            shutter.play();
            // this.preview = !this.preview

            // take snapshot and get image data
            Webcam.snap((data_uri) => {

                this.imageURI = data_uri
                // console.log(this.imageURI)
                sessionStorage.setItem('name', this.username)
                sessionStorage.setItem('email', this.useremail)
                sessionStorage.setItem('number', this.usernumber)
                sessionStorage.setItem('img', this.imageURI)

                location.href = '/Preview.html'
                // display results in page
                // document.getElementById('results').innerHTML =
                //     `<img class="w-75 shadow" src="' + data_uri + '"/>`;
            });
        },
        startWebcam() {
            if (this.username && this.useremail && this.usernumber) {
                this.openCamera = true
            }
        }
    }
})

app.component('Navbar', {
    template:
        /*html */
        `
    
    <header class="w-100 px-4 py-2 shadow d-flex justify-content-between align-items-center ">
        <div class="">
            <img src="./assets/ios/1024.png" alt="logo" class="img-fluid" width="60"  ondblclick="alert('version 1.3')" >
        </div>
        <slot></slot>
    </header>
    `,
    props: ['name']
})


app.component('camera', {
    template:
        /*html*/
        `
    <section class="container my-4">
        <div class="row justify-content-center px-3 gap-3">

            <div class="h-fit bg-white col-md-10 col-lg-5 col-12 shadow p-3 pb-0 rounded" dir="rtl">
                <div id="camera" class="w-100 h-800px"></div>

                <div class="d-flex justify-content-between align-items-center flex-column bg-light">
                    <h4 class="w-100 empty p-3 mt-3 fs-4 text-center text-second-green shadow-sm" contenteditable>
                        <slot></slot>
                    </h4>
                </div>
                <slot name="cam"></slot>
            </div>

        </div>
    </section>
    `,
    mounted() {

        Webcam.set({
            width: 560,
            height: 700,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#camera');
    }

})

app.component('swiper', {
    template:
        /*html*/
        `
    <div class="swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div class="bg-glass h-300px w-500px mx-auto px-3 py-5 rounded d-flex justify-content-evenly flex-column gap-2"
                    :dir="dir">
                    <input @keyup="able(username)" @keyup.right="slideNext(username)" @keyup.enter="slideNext(username)" type="text" v-model="username"
                        class="inp w-100 my-2 empty shadow-sm p-3 fs-3"
                        :placeholder="tarjem('Enter Full Name ;; ادخل الاسم الكامل',lang)">
                
                    
                    <button class="btn btn-success w-100 p-3 fs-5" @click="slideNext(username)" ><i class="bi bi-arrow-right"></i>
                    {{tarjem('Next;;التالي',lang)}}
                </button>
                </div>
            </div>

            <div class="swiper-slide">
                <div class="bg-glass h-300px w-500px mx-auto px-3 py-5 rounded d-flex justify-content-evenly flex-column gap-2"
                    :dir="dir">

                    <input @keyup="able(useremail)" @keyup.right="slideNext(useremail)" @keyup.enter="slideNext(useremail)" type="email" v-model="useremail"
                        class="inp w-100 my-2 empty shadow-sm p-3 fs-3"
                        :placeholder="tarjem('Enter Your Email;;ادخل بريدك الالكتروني',lang)">
                   
                        <button @click="slideNext(useremail)" class="btn btn-success w-100 p-3 fs-5"><i class="bi bi-arrow-right"></i>
                            {{tarjem('Next;;التالي',lang)}}
                        </button>
                        
                        <button @click="slidePrev(useremail)" class="btn btn-outline-success w-100 p-3 fs-5">
                            {{tarjem('Previous;;الخلف',lang)}}
                            <i class="bi bi-arrow-left"></i>
                        </button>
                </div>
            </div>

            <div class="swiper-slide">
                <div class="bg-glass h-300px w-500px mx-auto px-3 py-5 rounded d-flex justify-content-evenly flex-column gap-2"
                    :dir="dir">
                    <input @keyup.enter="startWebcam" type="number" v-model="usernumber"
                        class="inp w-100 my-2 empty shadow-sm p-3 fs-3"
                        :placeholder="tarjem('Enter Your Number;;ادخل رقم هاتفك',lang)">
                    <button class="w-100 btn btn-success p-3 fs-5" @click="startWebcam" >
                        {{tarjem('Take a Selfie;;التقط صورة',lang)}} </button>

                    <div class="swiper-button-prev my-3 w-100">
                        <button class="btn btn-outline-success w-100 p-3 fs-5">
                            {{tarjem('Previous;;الخلف',lang)}}
                            <i class="bi bi-arrow-left"></i>
                        </button>
                    </div>

                </div>
            </div>

        </div>
    </div>
    `,
    mounted() {

        var swiper = new Swiper('.swiper', {

            spaceBetween: 15,
            allowTouchMove: false,
            keyboard: {
                // enabled: true,
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });


    },
    data() {
        return {
            dis: true,
            username: '',
            useremail: '',
            usernumber: '',
            cur: 'username'

        }
    },
    methods: {

        startWebcam() {
            this.$emit('cred', {
                name: this.username,
                email: this.useremail,
                number: this.usernumber
            })
        },

        slideNext(x) {
            if (x != '') document.querySelector('.swiper').swiper.slideNext()
            this.dis = true

        },
        slidePrev(x) {
            // if (x != '') document.querySelector('.swiper').swiper.slidePrev()
            document.querySelector('.swiper').swiper.slidePrev()
            this.dis = false
        },
        able(x) {
            if (x != '') {
                this.dis = false
            } else this.dis = true
        },


        isArabic(text) {
            var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
            result = pattern.test(text);
            return result;
        },
        isEng(text) {

            var pattern = /[A-z]/gi;
            result = pattern.test(text);
            return result;
        },
        isRus(text) {

            var pattern = /[\u0400-\u04FF]/gi;
            result = pattern.test(text);
            return result;
        },
        tarjem(text, lang) {

            var res;
            // var lang = 'arb'
            // console.log('tarjem')
            // var text = `привет e ;; hello world ;; e السلام عليكم `
            if (lang == 'arb') {
                var demo = text.split(';;')
                demo.forEach(e => {
                    if (this.isArabic(e)) res = e
                })
            } else {
                if (lang == 'eng') {

                    var demo = text.split(';;')
                    demo.forEach(e => {
                        if (this.isEng(e)) res = e
                    })
                } else {
                    if (lang == 'rus') {

                        var demo = text.split(';;')
                        demo.forEach(e => {
                            if (this.isRus(e)) res = e
                        })
                    }
                }
            }
            return res
        }
    },
    props: ['lang', 'dir'],
    emits: ['cred']

})

app.component('spinner', {
    template:
        /*html*/
        `
    
    <section v-if="spin" :dir="dir" class="z-200 w-100 h-100 bg-glass position-fixed top-0 start-0 d-flex justify-content-center align-items-center">
        <div class="w-50 h-25 p-3 d-flex justify-content-center align-items-center flex-column gap-3">
            <div class="spinner-grow text-light-green" role="status"></div>
            <slot></slot>
        </div>
    </section>
    `,
    props: ['spin', 'dir']
})
app.mount('#app')