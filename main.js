

const outputPreview = document.getElementById('output');
const textCode = document.getElementById('text-code');
const textCode2 = document.getElementById('text-code2');

const styleCode = document.getElementById('style-code');
const imageElement = document.querySelector('#watercolor-frame > img');
const frameElement = document.getElementsByClassName('frame')[0];
const pageElement = document.getElementsByClassName('page')[0];

//  BACKGROUND CSS
let backgroundStyles = {
    frame : {
        'background-color'  : '#a005',
        'background-size'   : 'cover',
        'position'          : 'absolute',
        'mask-mode'         : 'alpha',
        'mask-position-x'   : '0%',
        'mask-position-y'   : '0%',
    },
    img : {
        'position'  : 'absolute',
        'overflow'  : 'clip'

    }
}

let frameTag = {
    tag : 'div',
    styles : {
        'mask-image'        : `url('assets/masks/RightMask-min.png')`,
        'mask-repeat'       : 'no-repeat',
        'mask-size'         : 'cover',
        'top'               : '0',
        'left'              : '0',
        'height'            : '100%',
        'width'             : '100%',
    },
    attributes : {
        'id'        : undefined,
        'className' : 'frame'
    }
};

let imageTag = {
    tag : 'img',
    styles : {
        'top'   : '0',
        'left'  : '0'
    },
    attributes : {
        'id'        : '',
        'className' : '',
        'alt'       : '',
        'title'     : '',
        'src'       : 'https://images.unsplash.com/photo-1637139500367-b3fd995a31e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    }
    
}



updateImageTag();
updateFrameTag();
printCodeForStyleEditor();

function printCodeForStyleEditor() {
    const frameRules = [
    `.frame {`,
    Object.entries(backgroundStyles.frame).map(rule=>[`  ${rule[0]}:${rule[1]};`]).join('\n'),
    `}\n`
    ].join('\n');

    const imgRules = [
    `.frame img {`,
    Object.entries(backgroundStyles.img).map(rule=>[`  ${rule[0]}:${rule[1]};`]).join('\n'),
    `}\n`
    ].join('\n');

    styleCode.value = frameRules + '\n' + imgRules;
    document.getElementsByTagName('style')[0].innerText = frameRules + '\n' + imgRules;
}


function printCodeForTextEditor() {
    let imageCSSDeclarations = Object.entries(imageTag.styles).map(rule => [`${rule[0]}:${rule[1]}`]);
    const imageMarkdown = `![${imageTag.attributes.alt}](${imageTag.attributes.src}) {${[imageTag.attributes.id,imageTag.attributes.className,imageCSSDeclarations].filter(Boolean).join(',')}}`;
    let frameCSSDeclarations = Object.entries(frameTag.styles).map(rule => [`${rule[0]}:${rule[1]}`]);
    const frameMarkdown = [
        `{{${[frameTag.attributes.id,frameTag.attributes.className, frameCSSDeclarations].filter(Boolean).join(',')}`,
        imageMarkdown,
        `}}`
    ].join('\n');
    textCode.value = frameMarkdown;
}



// IMAGE

function updateImageTag() {
    Object.assign(imageElement, imageTag.attributes);
    let rulesString = Object.entries(imageTag.styles).map(rule => [`${rule[0]}: ${rule[1]};`]);
    imageElement.setAttribute('style', rulesString.join(' '));
    printCodeForTextEditor()

}

document.getElementById('image-URL').addEventListener('input',(evt)=>{
    imageTag.attributes.src = evt.target.value;
    updateImageTag()
});

document.getElementById('image-name').addEventListener('input',(evt)=>{
    imageTag.attributes.alt = evt.target.value;
    imageTag.attributes.title = evt.target.value;
    imageTag.attributes.id = '#' + evt.target.value.split(" ").join("-");
    updateImageTag()
});

document.getElementById('image-size').addEventListener('input',(evt)=>{
    const orientation = frameElement.getBoundingClientRect().height > frameElement.getBoundingClientRect().width ? 'portrait' : 'landscape';
    const hozInput = document.getElementById('image-hoz-position');
    const verInput = document.getElementById('image-ver-position');
    // take % value of input and apply it to frames height
    if(orientation === 'portrait'){
        delete imageTag.styles.width;
        imageTag.styles.height = `${Math.round(frameElement.getBoundingClientRect().height * (parseFloat(evt.target.value) / 100))}px`;
    } else {
        delete imageTag.styles.height;
        imageTag.styles.width = `${Math.round(frameElement.getBoundingClientRect().width * (parseFloat(evt.target.value) / 100))}px`;
    };
    hozInput.min = `${(imageElement.getBoundingClientRect().width + 1) * -1}`;  // the +1 is because of the rounding...without it, it sometimes doesn't allow for shifting completely off page
    hozInput.max = `${pageElement.getBoundingClientRect().width + 1}`;
    verInput.min = `${(imageElement.getBoundingClientRect().height + 1) * -1}`;
    verInput.max = `${pageElement.getBoundingClientRect().height + 1}`;
    updateImageTag()
});

document.getElementById('image-hoz-position').addEventListener('input',(evt)=>{
    imageTag.styles.left = `${Math.round(evt.target.value)}px`;
    updateImageTag()
});

document.getElementById('image-ver-position').addEventListener('input',(evt)=>{
    imageTag.styles.top = `${Math.round(evt.target.value)}px`;
    updateImageTag()
});


// MASK

function updateFrameTag() {
    Object.assign(frameElement, frameTag.attributes);
    let rulesString = Object.entries(frameTag.styles).map(rule => [`${rule[0]}: ${rule[1]};`]);
    frameElement.setAttribute('style', rulesString.join(' '));
    printCodeForTextEditor()
}

document.getElementById('mask-URL').addEventListener('input',(evt)=>{
    frameTag.styles["mask-image"] = evt.target.value.length > 0 ? `url(${evt.target.value})` : '';
    updateFrameTag();
});

document.getElementById('frame-size').addEventListener('input',(evt)=>{
    const orientation = pageElement.getBoundingClientRect().height > pageElement.getBoundingClientRect().width ? 'portrait' : 'landscape';
    let imgRatio;
    const img = new Image();
    img.src= document.getElementById('mask-URL').value;
    imgRatio = img.naturalWidth / img.naturalHeight;
    const hozInput = document.getElementById('frame-hoz-position');
    const verInput = document.getElementById('frame-ver-position');
    // take % value of input and apply it to frames height
    if(orientation === 'portrait'){
        frameTag.styles.height = `${Math.round(pageElement.getBoundingClientRect().height * (parseFloat(evt.target.value) / 100))}px`;
        frameTag.styles.width = parseFloat(frameTag.styles.height) * imgRatio + 'px';
        console.log(`height: ${frameTag.styles.height} -- width: ${frameTag.styles.width}`);
    } else {
        frameTag.styles.width = `${Math.round(pageElement.getBoundingClientRect().width * (parseFloat(evt.target.value) / 100))}px`;
        frameTag.styles.height = parseFloat(frameTag.styles.width) * imgRatio + 'px';
        console.log(`height: ${frameTag.styles.height} -- width: ${frameTag.styles.width}`);
    };
    hozInput.min = `${(frameElement.getBoundingClientRect().width + 1) * -1}`;  // the +1 is because of the rounding...without it, it sometimes doesn't allow for shifting completely off page
    hozInput.max = `${pageElement.getBoundingClientRect().width + 1}`;
    verInput.min = `${(frameElement.getBoundingClientRect().height + 1) * -1}`;
    verInput.max = `${pageElement.getBoundingClientRect().height + 1}`;
    updateFrameTag()
});

document.getElementById('frame-hoz-position').addEventListener('input',(evt)=>{
    frameTag.styles.left = `${Math.round(evt.target.value)}px`;
    updateFrameTag();
});

document.getElementById('frame-ver-position').addEventListener('input',(evt)=>{
    frameTag.styles.top = `${Math.round(evt.target.value)}px`;
    updateFrameTag();
});



