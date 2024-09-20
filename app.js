//  slice(-2) extracts the last two elements in the sequence, adding "0" if string is a single char
function doubleDigits(num) {
    return ("0" + num).slice(-2);
  }
  
  const time_display = document.querySelector("#local-time");
   
  // GET LOCAL TIME
  function getCurrentTime() {
    const NOW = new Date();
    const HOUR = NOW.getHours();
    const MINUTES = NOW.getMinutes();
    const IS_AM = HOUR >= 0 && HOUR < 12;
    const FULL_TIME = `${HOUR % 12 === 0 ? 12 : HOUR % 12}:${doubleDigits(
      MINUTES
    )} ${IS_AM ? "AM" : "PM"}`;
  
    time_display.textContent = FULL_TIME;
    clearInterval(getCurrentTime, 1000);
  }
  
  setInterval(getCurrentTime, 1000);
  
  // STOP WATCH
  const timer = document.querySelector("#screen1");
  const tracker = document.querySelector(".tracker");
  const startBtn = document.querySelector(".start-btn");
  const stopBtn = document.querySelector(".stop-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const lapBtn = document.querySelector(".lap-btn");
  const toolbarLower = document.querySelector(".toolbar-lower");
  const slider = document.querySelector(".slider");
  const timerInAnalog = document.querySelector(".timerInAnalog");
  const mc_hand1 = document.querySelector(".mc_hand1");
  const mc_hand2 = document.querySelector(".mc_hand2");
  const hhc_hand = document.querySelector(".hhc_hand");
  const mc_hand1_lap = document.querySelector(".mc_hand1_lap");
  const mc_hand2_lap = document.querySelector(".mc_hand2_lap");

  let isLapBtnDarker = true;
  if (isLapBtnDarker){
    lapBtn.style.backgroundColor = '#2C2C2E';
    lapBtn.style.color = '#A9A9A9';
    lapBtn.disabled = true;
  }
// Function to update the toolbar background color
function updateToolbarBackgroundColor() {
    if (tracker.offsetHeight > 267) {
        toolbarLower.style.backgroundColor = '#1F1F1F';
    } else {
        toolbarLower.style.backgroundColor = ''; // Reset to default if needed
    }
}

// Create a MutationObserver to watch for changes to the .tracker element
const observer = new MutationObserver(() => {
    updateToolbarBackgroundColor();
});

// Configuration for the observer
const config = { attributes: true, childList: true, subtree: true };

// Start observing the .tracker element
observer.observe(tracker, config);

// Initial check in case the size is already above the threshold
updateToolbarBackgroundColor();

  class Counter {
    constructor(minutes = 0, seconds = 0, milliseconds = 0) {
      this.minutes = minutes;
      this.seconds = seconds;
      this.milliseconds = milliseconds;
  
      this.startTimer = function () {
        this.milliseconds++;
        if (this.milliseconds > 99) {
          this.seconds++;
          this.milliseconds = 0;
        }
        if (this.seconds > 59) {
          this.minutes++;
          this.seconds = 0;
        }
      };
    }
  }
  
  let IS_COUNTING = false;
  let INTERVAL;
  let LAPS = [];
  let CURRENT_COUNTER;
  let MAIN_COUNTER = new Counter();
  
  function updateHTML() {
    startBtn.style.display = IS_COUNTING ? "none" : "block";
    stopBtn.style.display = IS_COUNTING ? "block" : "none";
    resetBtn.style.display = IS_COUNTING ? "none" : "block";
    lapBtn.style.display = IS_COUNTING ? "block" : "none";
    let text = `
        <h1><span class = "minutes">${doubleDigits(MAIN_COUNTER.minutes)}</span>:<span class="seconds">${doubleDigits(
      MAIN_COUNTER.seconds
    )}</span>.<span class= "milliseconds">${doubleDigits(
      MAIN_COUNTER.milliseconds
    )}</span></h1>
   `;
    timer.innerHTML = text;
    timerInAnalog.innerHTML = text;
  }

// Helper function to calculate the total time of a lap in milliseconds
function calculateLapTime(lap) {
    return lap.minutes * 60 * 1000 + lap.seconds * 1000 + lap.milliseconds;
  }
  
  function updateLapHTML() {
    if (LAPS.length >= 3) {
      // Get fastest and slowest laps from all laps (starting from the first lap)
      let fastestLap = LAPS[0];
      let slowestLap = LAPS[0];
  
      LAPS.forEach((lap) => {
        if (calculateLapTime(lap) < calculateLapTime(fastestLap)) {
          fastestLap = lap;
        }
        if (calculateLapTime(lap) > calculateLapTime(slowestLap)) {
          slowestLap = lap;
        }
      });
  
      // Render the laps
      tracker.innerHTML = LAPS.map((lap, index) => {
        let lapClass = '';
  
        // Apply styles for the fastest and slowest laps
        if (lap === fastestLap) {
          lapClass = 'fastest-lap'; // Apply green for the fastest lap
        } else if (lap === slowestLap) {
          lapClass = 'slowest-lap'; // Apply red for the slowest lap
        }
  
        return `
          <div class="lap-data ${lapClass}">
            <span>Lap ${index + 1}</span> 
            <span>${doubleDigits(lap.minutes)}:${doubleDigits(lap.seconds)}:${doubleDigits(lap.milliseconds)}</span>
          </div>
          <div class="lap-separator"></div>
        `;
      }).reverse().join(" ");
    } else {
      // Render laps without any fastest/slowest logic if less than 3 laps
      tracker.innerHTML = LAPS.map((lap, index) => `
        <div class="lap-data">
          <span>Lap ${index + 1}</span> 
          <span>${doubleDigits(lap.minutes)}:${doubleDigits(lap.seconds)}:${doubleDigits(lap.milliseconds)}</span>
        </div>
        <div class="lap-separator"></div>
      `).reverse().join(" ");
    }
  }
  
    
  // CREATE && PUSH NEW LAP
  function addLap() {
    CURRENT_COUNTER = new Counter();
    LAPS = [...LAPS, CURRENT_COUNTER];
  }
  
// Helper function to calculate the total time of a lap in milliseconds
function calculateLapTime(lap) {
    return lap.minutes * 60 * 1000 + lap.seconds * 1000 + lap.milliseconds;
  }
  
  // Function to update lap HTML with color indication for fastest and slowest laps
  function updateLapHTML() {
    tracker.innerHTML = LAPS.map((lap, index) => {
      // Apply styles for the fastest and slowest laps
      let lapClass = '';
      if (lap.isFastest) {
        lapClass = 'fastest-lap'; // Apply green for the fastest lap
      } else if (lap.isSlowest) {
        lapClass = 'slowest-lap'; // Apply red for the slowest lap
      }
  
      return `
        <div class="lap-data ${lapClass}">
          <span>Lap ${index + 1}</span> 
          <span>${doubleDigits(lap.minutes)}:${doubleDigits(lap.seconds)}.${doubleDigits(lap.milliseconds)}</span>
        </div>
        <div class="lap-separator"></div>
      `;
    }).reverse().join(" ");
  }
  
//   Function to find and mark the fastest and slowest laps
  function markFastestAndSlowestLaps() {
    if (LAPS.length < 3) return; // Only compare laps if there are at least 3

    const lapsToCompare = LAPS.slice(0, -1);
  
    let fastestLap = lapsToCompare[0];
    let slowestLap = lapsToCompare[0];
  
    // Find the fastest and slowest lap
    lapsToCompare.forEach((lap) => {
      const lapTime = calculateLapTime(lap);
      if (lapTime < calculateLapTime(fastestLap)) fastestLap = lap;
      if (lapTime > calculateLapTime(slowestLap)) slowestLap = lap;
    });
  
    // Reset all lap flags
    lapsToCompare.forEach(lap => {
      lap.isFastest = false;
      lap.isSlowest = false;
    });
  
    // Mark the fastest and slowest laps
    fastestLap.isFastest = true;
    slowestLap.isSlowest = true;
  }
  
//   Function to create and push new lap
  function addLap() {
    CURRENT_COUNTER = new Counter();
    LAPS.push(CURRENT_COUNTER);
  
    // Mark the fastest and slowest laps after adding a new lap
    markFastestAndSlowestLaps();
  
    // Update the lap HTML
    updateLapHTML();
  }
    
  // Add event listener for lap button
  lapBtn.addEventListener("click", (event) => {
    addLap();
    mc_hand1_lap.classList.remove("hide");
    mc_hand1_lap.classList.add("show");
    mc_hand2_lap.classList.remove("hide");
    mc_hand2_lap.classList.add("show");
    mc_hand1_lap.classList.remove("stop");
    mc_hand2_lap.classList.remove("stop");
    mc_hand1_lap.classList.remove("go1");
    mc_hand2_lap.classList.remove("go2");
    void mc_hand1_lap.offsetWidth; // triggers reflow
    void mc_hand2_lap.offsetWidth;
    mc_hand1_lap.classList.add("go1");
    mc_hand2_lap.classList.add("go2");
});
  
  
  // START
  startBtn.addEventListener("click", (event) => {
    IS_COUNTING = true;
    isLapBtnDarker = false;
    lapBtn.style.backgroundColor = '#3A3A3C'
    lapBtn.style.color = '#fff';
    lapBtn.disabled = false;
    lapBtn.classList.add('lap-btn-hover');
    mc_hand1.classList.add("go1");
    mc_hand2.classList.add("go2");
    hhc_hand.classList.add("go3");
    mc_hand1.classList.remove("stop");
    mc_hand2.classList.remove("stop");
    hhc_hand.classList.remove("stop");
    mc_hand1_lap.classList.remove("stop");
    mc_hand2_lap.classList.remove("stop");
    // only add new lap on first click
    // must hit lap button to add additional laps
    if (!LAPS.length) addLap();
  
    INTERVAL = setInterval(() => {
      MAIN_COUNTER.startTimer();
      CURRENT_COUNTER.startTimer();
      updateHTML();
      updateLapHTML();
    }, 10);
  });
  
  // STOP
  stopBtn.addEventListener("click", () => {
    IS_COUNTING = false;
    clearInterval(INTERVAL);
    updateHTML();
    mc_hand1.classList.add("stop");
    mc_hand2.classList.add("stop");
    hhc_hand.classList.add("stop");
    mc_hand1_lap.classList.add("stop");
    mc_hand2_lap.classList.add("stop");
  });
  
  // RESET
  resetBtn.addEventListener("click", () => {
    IS_COUNTING = false;
    MAIN_COUNTER.minutes = 0;
    MAIN_COUNTER.seconds = 0;
    MAIN_COUNTER.milliseconds = 0;
    LAPS = [];
    updateLapHTML();
    updateHTML();
    resetBtn.style.display = "none";
    lapBtn.style.display = "block";
    isLapBtnDarker = true;
    lapBtn.style.backgroundColor = '#2C2C2E';
    lapBtn.style.color = '#A9A9A9';
    lapBtn.disabled = true;
    lapBtn.classList.remove('lap-btn-hover');
    mc_hand1.classList.remove("go1");
    mc_hand2.classList.remove("go2");
    hhc_hand.classList.remove("go3");
    mc_hand1.classList.remove("stop");
    mc_hand2.classList.remove("stop");
    hhc_hand.classList.remove("stop");
    mc_hand1_lap.classList.remove("go1");
    mc_hand2_lap.classList.remove("go2");
    mc_hand1_lap.classList.remove("stop");
    mc_hand2_lap.classList.remove("stop");
    mc_hand1_lap.classList.remove("show");
    mc_hand2_lap.classList.remove("show");
    mc_hand1_lap.classList.add("hide");
    mc_hand2_lap.classList.add("hide");
  });
  

// A code for draggable timer

let startX = 0;
let currentTransform = 0;
let isDragging = false;

const screen1 = document.querySelector('#screen1');
const screen2 = document.querySelector('#screen2');

function handleDragStart(e) {
    startX = e.clientX;
    currentTransform = parseFloat(window.getComputedStyle(screen1).transform.split(',')[4]) || 0;
    isDragging = true;
    e.preventDefault();
}

function handleDrag(e) {
    if (!isDragging) return;

    const offsetX = e.clientX - startX;
    const newTransform = Math.max(-screen1.clientWidth, Math.min(0, currentTransform + offsetX));

    // Ensure smooth, continuous dragging
    screen1.style.transform = `translateX(${newTransform}px)`;
    screen2.style.transform = `translateX(${newTransform + screen2.clientWidth}px)`;
}

function handleDragEnd(e) {
    if (!isDragging) return;

    const screenWidth = screen1.clientWidth;
    const threshold = screenWidth / 4; // Reduce the threshold to make switching more responsive
    const transform = parseFloat(window.getComputedStyle(screen1).transform.split(',')[4]) || 0;

    // Use more precise transition logic to avoid any gap
    if (Math.abs(transform) > threshold) {
        if (transform < 0) {
            screen1.style.transform = `translateX(-${screenWidth}px)`;
            screen2.style.transform = `translateX(0px)`;
            slider.style.setProperty('--slider-before-background', '#5E5E5E');
            slider.style.setProperty('--slider-after-background', '#FFFFFF');

        } else {
            screen1.style.transform = `translateX(0px)`;
            screen2.style.transform = `translateX(${screenWidth}px)`;
            slider.style.setProperty('--slider-before-background', '#FFFFFF');
            slider.style.setProperty('--slider-after-background', '#5E5E5E');
        }
    } else {
        screen1.style.transform = `translateX(0px)`;
        screen2.style.transform = `translateX(${screenWidth}px)`;
        slider.style.setProperty('--slider-before-background', '#FFFFFF');
        slider.style.setProperty('--slider-after-background', '#5E5E5E');
    }

    isDragging = false;
}

screen1.addEventListener('mousedown', handleDragStart);
screen2.addEventListener('mousedown', handleDragStart);
document.addEventListener('mousemove', handleDrag);
document.addEventListener('mouseup', handleDragEnd);

