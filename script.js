//The following JS code implements two essential functionalities for the blog:
// 1. It defines the logic to display all Plotly charts that where defined in the data_vis.ipynb section
// 2. It defines scrolling behaviour for the index.html blog
// The code was built by following the guidance of MDN Web Docs (developer.mozilla.org, n.d.) and optimized using ChatGPT 5 (OpenAI, 2025)

// we define a js function to load each plots JSON file and render its plotly chart
async function loadAndPlot(url, divId) {
    try {
        // we first load the json file by fetching the JSON file's url/location
        const response = await fetch(url);
        //if the response is not ok, we throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        //if we don't get an error we parse the JSON content
        const jsonData = await response.json();
         // Now we define Plotly config to make the chart responsive
        const config = { responsive: true };
        
        //Once we have the json Data parsed and the plotly configuration ready we can plot the chart
        Plotly.newPlot(divId, jsonData.data, jsonData.layout, config).then(function() {
            //for some visualisations we indeed have animations so we need to check if the json file contains frames
            if(jsonData.frames) {
                //if the json file does contain frames we add the frames to the plot
                Plotly.addFrames(divId, jsonData.frames);
            }
        });
        
    } 
    // if the try prompted an error, below the logic to handle the error is defined
    catch (error) {
        //first we print the error message in the browser's console with the http error
        console.error("Could not load chart for " + divId, error);
        //we display an error message in the blog if the chart could not be displayed
        document.getElementById(divId).innerHTML = `
            <div style="display:flex; height:100%; align-items:center; justify-content:center; color:#f44336;">
                <p>Error loading chart!!!!!! <br> 
                1. Ensure '${url}' is in the same folder. <br> 
                2. You must run this via a local server (e.g., VS Code Live Server or 'python -m http.server').</p>
            </div>
        `;
    }
}

// Now that we have defined the function to read, parse and display the plotly charts we can call it
// by passing the url and the visualisation's id in the main html file.
loadAndPlot('final_visualisations/production_map.json', 'vis-production-map');
loadAndPlot('final_visualisations/consumers_sankey.json', 'vis-consumers-sankey');
loadAndPlot('final_visualisations/price_line.json', 'vis-price-line');
loadAndPlot('final_visualisations/weather.json', 'vis-weather');
loadAndPlot('final_visualisations/inequality.json', 'vis-inequality');
loadAndPlot('final_visualisations/futures_chart.json', 'vis-finance');


// the code below defines interactivity logic, in other words it makes scrolling nice inside the blog
// we first create a dictionary called observerOptions to store the InteractionObserver options for quick retrieval
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// now we initialize an IntersectionObserver object to implement the scrolling logic
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // if the html element becomes visible, that is when the user scrolls to it, we add the css class
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

//finally we attach the defined observer object to all html elements that have .fade-in as a class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});


// References:
//developer.mozilla.org. (n.d.). Intersection Observer API - Web APIs | MDN. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API.