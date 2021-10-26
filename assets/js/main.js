const $  = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    
    const cd = $('.cd');
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const player = $('.player')
    const progress = $('.progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const ramdonBtn = $('.btn-random')
    const repeatSong = $('.btn-repeat')
    const playlist = $('.playlist')
    const progressArea = $('.progress-area')
    const volumeSlider = $('#volume_silder')

    const app = {
      currentIndex: 0,
      isPlaying: false,
      isRandom: false,
      isRepeat: false,
      songs: [
        {
          name: 'Tết miền tây',
          singger: 'Jombie',
          path: './assets/music/song1.mp3',
          image: './assets/img/song1.jpg'
        },
        {
          name: 'Liitle Girl',
          singger: 'Piano',
          path: './assets/music/song2.mp3',
          image: './assets/img/song2.jpg'
        },
        {
          name: 'Anh mệt rồi',
          singger: 'Lofi - song',
          path: './assets/music/song3.mp3',
          image: './assets/img/song3.jpg'
        },
        {
          name: 'Ric Flair Drip',
          singger: '21 Savage',
          path: './assets/music/song4.mp3',
          image: './assets/img/song4.jpg'
        },
        {
          name: 'Taste',
          singger: 'Tyga',
          path: './assets/music/song5.mp3',
          image: './assets/img/song5.jpg'
        },
        {
          name: 'song6',
          singger: 'song6',
          path: './assets/music/song6.mp3',
          image: './assets/img/song6.jpg'
        },
        {
          name: 'song7',
          singger: 'song7',
          path: './assets/music/song7.mp3',
          image: './assets/img/song7.png'
        },
        {
          name: 'song8',
          singger: 'song8',
          path: './assets/music/song8.mp3',
          image: './assets/img/song8.jpg'
        },
        {
          name: 'song9',
          singger: 'song9',
          path: './assets/music/song9.mp3',
          image: './assets/img/song9.jpg'
        },
        {
          name: 'song10',
          singger: 'song10',
          path: './assets/music/song10.mp3',
          image: './assets/img/song10.jpg'
        },
        {
          name: 'song11',
          singger: 'song11',
          path: './assets/music/song11.mp3',
          image: './assets/img/song11.jpg'
        },
      ],
      render: function () {
        const htmls = this.songs.map((song,index) => {
          return `
              <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                <div class="thumb" 
                  style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singger}</p>
                </div>
                <div class="option" style="display: none">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>
            ` 
        })
        playlist.innerHTML = htmls.join('')
      },
      defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
          get: function () {
            return this.songs[this.currentIndex];
          }
        });
      },
      handleEvents: function () {
        const _this = this
        const cdWitdth = cd.offsetWidth;

        // xu ly cd quay / dung
        const cdThumbAnimate = cdThumb.animate([
          {transform: 'rotate(360deg)'}
        ],{
          duration: 10000,
          iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // xử lý phóng to thu nhỏ cd
        document.onscroll = function () {
          // làm nhỏ cd theo chiều kéo xuống và ngược lại.
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const newCdWidth = cdWitdth - scrollTop;

          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
          cd.style.opacity = newCdWidth / cdWitdth;
        }

        // Xử lý play
        playBtn.onclick = function () {
          if (_this.isPlaying) {
            audio.pause();
          }else{
            audio.play();
          }
        }

        // Khi bai nhac duoc play
        audio.onplay = function () {
          _this.isPlaying = true;
          player.classList.add('playing')
          cdThumbAnimate.play();
        }

        // khi bai nhac pause
        audio.onpause = function () {
          _this.isPlaying = false;
          player.classList.remove('playing')
          cdThumbAnimate.pause();
        }

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function (e) {
            const currentTime = e.target.currentTime;
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.style.width = `${progressPercent}%`;

                // thoi gian khi nhac chay
                let musicCurrentTime = document.querySelector(".current-time");
                let currentMin = Math.floor(currentTime / 60);
                let currentSec = Math.floor(currentTime % 60);
                if(currentSec < 10){ //if sec is less than 10 then add 0 before it
                    currentSec = `0${currentSec}`;
                }
                musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

                let musicDuartion = document.querySelector(".max-duration");
                let mainAdDuration = audio.duration;
                let totalMin = Math.floor(mainAdDuration / 60);
                let totalSec = Math.floor(mainAdDuration % 60);
                if(totalSec < 10){ //if sec is less than 10 then add 0 before it
                    totalSec = `0${totalSec}`;
                }
                musicDuartion.innerText = `${totalMin}:${totalSec}`;
          }
        }

        // Xu ly khi tua bai nhac
        progressArea.onclick = function (e) {
          let progressWidth = progressArea.clientWidth;
          let clickedOffsetX = e.offsetX;
          let songDuration = audio.duration;
          audio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
          audio.play();
        }

        // khi next bai hat
        nextBtn.onclick = function () {
          if (_this.isRandom) {
          _this.randomSong();
          }else{
            _this.nextSong();
          }
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }

        // khi prev bbai hat
        prevBtn.onclick = function () {
          if(_this.isRandom) {
            _this.randomSong();
          }else{
            _this.prevSong();
          }
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }

        // random song
        ramdonBtn.onclick = function (e) {
          _this.isRandom = !_this.isRandom
          ramdonBtn.classList.toggle('active',_this.isRandom);
        }

        // xu ly next song khi audio ended
        audio.onended = function () {
          if (_this.isRepeat) {
            audio.play();
          }else{
            nextBtn.onclick();
          }
        }

        // xu ly repeat song
        repeatSong.onclick = function () {
          _this.isRepeat = !_this.isRepeat
          repeatSong.classList.toggle('active',_this.isRepeat);
        }

        // Xu ly tang giam volume
        volumeSlider.onchange = function () {
          audio.volume = volumeSlider.value / 100;
        }
        

        // xu ly nhan vao playlist
        playlist.onclick = function (e) {
          const songNode = e.target.closest('.song:not(.active)')
          if(songNode || e.target.closest('.option')){
            // xu ly khi click vao song
            if (songNode) {
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadCurrentSong();
              audio.play();
              _this.render();
            }
            // xu ly khi click vao option
            if (e.target.closest('.option')) {
              
            }
          }
        }
      },
      loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
      },
      nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0
        }
        this.loadCurrentSong();  
      },
      prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
      },
      randomSong: function () {
        let newIndex
        do {
          newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
      },
      scrollToActiveSong: function () {
        setTimeout(() => {
          if(this.currentIndex === 0 || this.currentIndex === 1){
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'end'
             })    
        }
        else{
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'nearest'
             })    
        }
        }, 300);
      },
      start: function () {
        // Định nghĩa các thuộc tính cho Oject
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong(); 

        // Render playlist
        this.render();
      }
    }

    app.start()
