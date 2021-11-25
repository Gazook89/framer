

const outputPreview = document.getElementById('output');
const textCode = document.getElementById('text-code');
const textCode2 = document.getElementById('text-code2');

const styleCode = document.getElementById('style-code');
const imageElement = document.getElementsByTagName('img')[0];
const frameElement = document.getElementsByClassName('frame')[0];
const pageElement = document.getElementsByClassName('page')[0];


let frameStyles = {
    'mask-image'        : `url('assets/masks/RightMask-min.png')`,
    'background-size'   : 'cover',
    'mask-repeat'       : 'no-repeat',
    'mask-size'         : 'cover',
    'mask-position-x'   : '50%',
    'mask-position-y'   : '50%',
    'height'            : '100%',
    'width'             : '100%',
    'position'          : 'absolute',
    'top'               : '0',
    'left'              : '0',
    'background-color'  : '#a005'
};

let imageStyles = {
    'top'               : '0',
    'left'              : '0'
}

// previewRule(); 

previewRule(frameStyles, frameElement);
previewRule(imageStyles, imageElement);


function printCode() {
    textCode2.textContent = frameElement.outerHTML;
}

// IMAGE

document.getElementById('image-URL').addEventListener('input',(evt)=>{
    imageElement.src = evt.target.value;
    printCode();
});

document.getElementById('image-name').addEventListener('input',(evt)=>{
    imageElement.alt = evt.target.value;
    imageElement.title = evt.target.value;
    imageElement.id = evt.target.value.split(" ").join("-");
});

document.getElementById('image-size').addEventListener('input',(evt)=>{
    const orientation = frameElement.getBoundingClientRect().height > frameElement.getBoundingClientRect().width ? 'portrait' : 'landscape';
    // reset <img> width and height attributes to null
    imageElement.removeAttribute('width');
    imageElement.removeAttribute('height');
    // take % value of input and apply it to frames height
    if(orientation === 'portrait'){
        imageElement.height = frameElement.getBoundingClientRect().height * (parseFloat(evt.target.value) / 100);
    } else {
        imageElement.width = frameElement.getBoundingClientRect().width * (parseFloat(evt.target.value) / 100);
    };
    document.getElementById('image-hoz-position').min = `${imageElement.getBoundingClientRect().width * -1}`;
    document.getElementById('image-hoz-position').max = `${pageElement.getBoundingClientRect().width}`;
    document.getElementById('image-ver-position').min = `${imageElement.getBoundingClientRect().height * -1}`;
    document.getElementById('image-ver-position').max = `${pageElement.getBoundingClientRect().height}`;
})

document.getElementById('image-hoz-position').addEventListener('input',(evt)=>{
    imageStyles["left"] = `${evt.target.value}px`;
    previewRule(imageStyles, imageElement);
});

document.getElementById('image-ver-position').addEventListener('input',(evt)=>{
    imageStyles["top"] = `${evt.target.value}px`;
    previewRule(imageStyles, imageElement);
});


// MASK

document.getElementById('mask-URL').addEventListener('input',(evt)=>{
    frameStyles["mask-image"] = evt.target.value.length > 0 ? `url('${evt.target.value}')` : '';
    previewRule(frameStyles, frameElement);
});

document.getElementById('frame-hoz-position').addEventListener('input',(evt)=>{
    frameStyles["mask-position-x"] = `${evt.target.value}in`;
    previewRule(frameStyles, frameElement);
});

document.getElementById('frame-ver-position').addEventListener('input',(evt)=>{
    frameStyles["mask-position-y"] = `${evt.target.value}in`;
    previewRule(frameStyles, frameElement);
});

function previewRule(styleSet, previewElement) {
    let rulesString = Object.entries(styleSet).map(rule => [`${rule[0]}: ${rule[1]};`]);
    previewElement.setAttribute('style', rulesString.join(' '));

}

