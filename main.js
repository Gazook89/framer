

const outputPreview = document.getElementById('output');
const textCode = document.getElementById('text-code');
const textCode2 = document.getElementById('text-code2');

const styleCode = document.getElementById('style-code');
const imageElement = document.querySelector('#watercolor-frame > img');
const frameElement = document.getElementsByClassName('frame')[0];
const pageElement = document.getElementsByClassName('page')[0];

// Array.prototype.sample = function(){
//     return this[Math.floor(Math.random()*this.length)];
// };

// function randomInteger(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// //  BACKGROUND CSS
// let backgroundStyles = {
//     frame : {
//         'background-color'      : '#a005',
//         'background-size'       : 'cover',
//         'position'              : 'absolute',
//         'mask-mode'             : 'alpha',
//         'mask-position-x'       : '0%',
//         'mask-position-y'       : '0%',
//         '-webkit-mask-repeat'   : 'no-repeat',
//         '-webkit-mask-size'     : 'contain', 
//         'margin-top'            : '0 !important'
//     },
//     img : {
//         'position'  : 'absolute',
//         'overflow'  : 'clip'

//     }
// }

// let frameTag = {
//     tag : 'div',
//     styles : {
//         '-webkit-mask-image'    : `url(assets/masks/WC_Vertical_Right_1_rptY-min.png)`,
//         'top'                   : '',
//         'left'                  : '',
//         'height'                : '100%',
//         'width'                 : '100%'
//     },
//     attributes : {
//         'id'        : undefined,
//         'className' : 'frame'
//     },
//     meta : {
//         'bgImgRatio' : undefined
//     }
// };

// let imageTag = {
//     tag : 'img',
//     styles : {
//         'top'   : '0',
//         'left'  : '0'
//     },
//     attributes : {
//         'id'        : '',
//         'className' : '',
//         'alt'       : '',
//         'title'     : '',
//         'src'       : 'https://images.unsplash.com/photo-1637139500367-b3fd995a31e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
//     }
    
// }



// function printCodeForStyleEditor() {
//     const frameRules = [
//     `.frame {`,
//     Object.entries(backgroundStyles.frame).map(rule=>[`  ${rule[0]}:${rule[1]};`]).join('\n'),
//     `}\n`
//     ].join('\n');

//     const imgRules = [
//     `.frame img {`,
//     Object.entries(backgroundStyles.img).map(rule=>[`  ${rule[0]}:${rule[1]};`]).join('\n'),
//     `}\n`
//     ].join('\n');

//     styleCode.value = frameRules + '\n' + imgRules;
//     document.getElementsByTagName('style')[0].innerText = frameRules + '\n' + imgRules;
// }



// function printCodeForTextEditor() {
//     let imageCSSDeclarations = Object.entries(imageTag.styles).map(rule => [`${rule[0]}:${rule[1]}`]);
//     const imageMarkdown = `![${imageTag.attributes.alt}](${imageTag.attributes.src}) {${[imageTag.attributes.id,imageTag.attributes.className,imageCSSDeclarations].filter(Boolean).join(',')}}`;
//     let frameCSSDeclarations = Object.entries(frameTag.styles).map(rule => [`${rule[0]}:${rule[1]}`]);
//     const frameMarkdown = [
//         `{{${[frameTag.attributes.id,frameTag.attributes.className, frameCSSDeclarations].filter(Boolean).join(',')}`,
//         imageMarkdown,
//         `}}`
//     ].join('\n');
//     textCode.value = frameMarkdown;
// }



// IMAGE

class Image {
    constructor(name, url, altText){
        this.name = name,
        this.url = url,
        this.altText = altText
    }

    initMoveImage(evt){
        // evt.preventDefault();
        const element = evt.target;
        initMove(evt, element)
    }

    render(){
        const imgElement = Object.assign(document.createElement('img'), {id: this.name, className: 'framed-image', alt: this.altText, src: this.url});
        imgElement.addEventListener('mousedown', this.initMoveImage);
        document.getElementsByClassName('frame')[0].append(imgElement);
    }
}

class Frame {
    constructor(name, url){
        this.name = name,
        this.url = url
    }

    

    initMoveFrame(evt){
        if(document.getElementById('frame-control').classList.contains('active')){
            const element = evt.currentTarget;
            initMove(evt, element)
        } else {
            return;
        }

    }


    render(){
        const frameElement = Object.assign(document.createElement('div'), {id: `${this.name}-frame`, className: `frame`});
        frameElement.style.maskImage = `url(${this.url})`;
        frameElement.style.width = '100%';
        frameElement.style.height = '100%';
        frameElement.addEventListener('mousedown', this.initMoveFrame, true);
        document.getElementById('p1').append(frameElement);

        document.getElementById('url-input').addEventListener('change', this.updateFrame)
        
    }
    
}

function initMove(evt, element){
    evt.preventDefault();
    evt.stopPropagation();

    document.getElementById('preview-hover-area').style.display = 'none';

    const elParent = element.parentElement;
    const page = element.closest('.page');

    let shiftX = evt.clientX - element.getBoundingClientRect().left;
    let shiftY = evt.clientY - element.getBoundingClientRect().top;

    element.style.zIndex = 500;
    element.style.opacity = .5;
    page.style.overflow = 'unset';
    // document.getElementById('p1').append(element);

    moveAt(evt.pageX, evt.pageY);
    
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX - elParent.getBoundingClientRect().left + 'px';
        element.style.top = pageY - shiftY - elParent.getBoundingClientRect().top + 'px';
    }

    function onMouseMove(evt) {
        moveAt(evt.pageX, evt.pageY);

        // element.style.visibility = 'hidden';
        // let elemBelow = document.elementFromPoint(evt.clientX, evt.clientY);
        // element.style.visibility = 'visible';
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
        element.style.zIndex = null;
        element.style.opacity = null;
        page.style.overflow = 'clip';
        // elParent.append(element);

        document.getElementById('preview-hover-area').style.display = 'flex';

    }

}




const frame = new Frame('lava', `assets/masks/WC_Vertical_Right_1_rptY-min.png`);
frame.render();

const image = new Image('lava', `https://images.unsplash.com/photo-1475598322381-f1b499717dda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80`, 'here is my photo');
image.render();


document.getElementById('image-control').addEventListener('click', (evt)=>{
    evt.target.classList.add('active');
    document.getElementById('frame-control').classList.remove('active');
    document.getElementById('url-input').value = image.url;
    resizeHandles(document.querySelector('.framed-image'));

})

const handles = {
    nw : {
        resize() {
            console.log('northwest handle');
        }
    },
    ne : {
        log() {
            console.log(('northeast handle'));
        }
    }
}

function resizeHandles(el){
    const handleArray = [['top', 'left'], ['top','right'], ['bottom','right'],  ['bottom','left']];
    const pane = document.getElementById('right-pane');
    for(let x=0;x<4;x++){
        const handleVerticalLoc = handleArray[x][0];
        const handleHorizontalLoc = handleArray[x][1];
        let posY = el.getBoundingClientRect()[handleVerticalLoc] - pane.getBoundingClientRect()[handleVerticalLoc] + pane.scrollTop;
        let posX = el.getBoundingClientRect()[handleHorizontalLoc] - pane.getBoundingClientRect()[handleHorizontalLoc] + pane.scrollLeft;  // "top" and "left" could be replaced with variables, so "bottom" and "right" could be passed in instead.



        const newHandle = Object.assign(document.createElement('div'), {id:'nw-handle', className:'handle'});
        newHandle.style[handleVerticalLoc] = posY - 12 + 'px';
        newHandle.style[handleHorizontalLoc] = posX - 12 + 'px';
        newHandle.addEventListener('mousedown', resize);


        function resize(evt){
            evt.preventDefault();

            const parentY = el.parentElement.getBoundingClientRect()[handleVerticalLoc];
            const parentX = el.parentElement.getBoundingClientRect()[handleHorizontalLoc];


            let shiftY = evt.clientY - newHandle.getBoundingClientRect()[handleVerticalLoc];
            let shiftX = evt.clientX - newHandle.getBoundingClientRect()[handleHorizontalLoc];


            moveAt(evt.pageX, evt.pageY);

            function moveAt(pageX, pageY) {
                newHandle.style[handleVerticalLoc]= pageY - shiftY - pane.getBoundingClientRect()[handleVerticalLoc] + 'px';
                newHandle.style[handleHorizontalLoc] = pageX - shiftX - pane.getBoundingClientRect()[handleHorizontalLoc] + 'px';
            }
        
            function onMouseMove(evt) {
                moveAt(evt.pageX, evt.pageY);

                el.style[handleVerticalLoc] = evt.pageY + newHandle.getBoundingClientRect().height - shiftY - parentY + 'px';
                el.style[handleHorizontalLoc] = evt.pageX + newHandle.getBoundingClientRect().width - shiftX - parentX + 'px';

 
            }

            document.addEventListener('mousemove', onMouseMove);

            newHandle.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                newHandle.onmouseup = null;
                
            }
            
        }

        pane.append(newHandle);
    }
}



document.getElementById('frame-control').addEventListener('click', (evt)=>{
    evt.target.classList.add('active');
    document.getElementById('image-control').classList.remove('active');
    document.getElementById('url-input').value = frame.url;
})

document.getElementById('url-input').addEventListener('input', (evt)=>{
    if(document.getElementById('frame-control').classList.contains('active')){
        document.querySelector('.frame').style.maskImage = `url(${evt.target.value}`;
        frame.url = evt.target.value;
    } else {
        document.querySelector('.framed-image').src = evt.target.value;
        image.url = evt.target.value;
    }
    
})

document.getElementById('name-input').addEventListener('input', (evt)=>{
    evt.target.value = evt.target.value.split(' ').join('-');
    document.querySelector('.framed-image').id = evt.target.value;
    document.querySelector('.frame').id = `${evt.target.value}-frame`;
    frame.name = evt.target.value;
    image.name = evt.target.value;
})

// function updateImageTag() {
//     Object.assign(imageElement, imageTag.attributes);
//     let rulesString = Object.entries(imageTag.styles).map(rule => [`${rule[0]}: ${rule[1]};`]);
//     imageElement.setAttribute('style', rulesString.join(' '));
//     printCodeForTextEditor();

// }

// ['input','change'].forEach(eventType=>document.getElementById('image-URL').addEventListener(eventType,(evt)=>{
//     console.log(evt.target.value);
//     imageTag.attributes.src = evt.target.value;
//     document.getElementById('image-size').dispatchEvent(new Event('change'));
//     updateImageTag()
// }));

// ['input','change'].forEach(eventType=>document.getElementById('image-name').addEventListener(eventType,(evt)=>{
//     imageTag.attributes.alt = evt.target.value;
//     imageTag.attributes.title = evt.target.value;
//     imageTag.attributes.id = '#' + evt.target.value.split(" ").join("-");
//     updateImageTag()
// }));

// ['input','change'].forEach(eventType=>document.getElementById('image-size').addEventListener(eventType,(evt)=>{
//     const orientation = frameElement.getBoundingClientRect().height > frameElement.getBoundingClientRect().width ? 'portrait' : 'landscape';
//     const hozInput = document.getElementById('image-hoz-position');
//     const verInput = document.getElementById('image-ver-position');
//     // take % value of input and apply it to frames height
//     if(orientation === 'portrait'){
//         delete imageTag.styles.width;
//         imageTag.styles.height = `${Math.round(frameElement.getBoundingClientRect().height * (parseFloat(evt.target.value) / 100))}px`;
//     } else {
//         delete imageTag.styles.height;
//         imageTag.styles.width = `${Math.round(frameElement.getBoundingClientRect().width * (parseFloat(evt.target.value) / 100))}px`;
//     };
//     evt.target.setAttribute('value', evt.target.value);
//     evt.target.setAttribute('title', evt.target.value + '%');
//     hozInput.min = `${(imageElement.getBoundingClientRect().width + 1) * -1}`;  // the +1 is because of the rounding...without it, it sometimes doesn't allow for shifting completely off page
//     hozInput.max = `${pageElement.getBoundingClientRect().width + 1}`;
//     verInput.min = `${(imageElement.getBoundingClientRect().height + 1) * -1}`;
//     verInput.max = `${pageElement.getBoundingClientRect().height + 1}`;
//     updateImageTag()
// }));

// ['input','change'].forEach(eventType=>document.getElementById('image-hoz-position').addEventListener(eventType,(evt)=>{
//     imageTag.styles.left = `${Math.round(evt.target.value)}px`;
//     updateImageTag()
// }));


// ['input','change'].forEach(eventType=>document.getElementById('image-ver-position').addEventListener(eventType,(evt)=>{
//     imageTag.styles.top = `${Math.round(evt.target.value)}px`;
//     updateImageTag()
// }));


// // MASK

// function updateFrameTag() {
//     Object.assign(frameElement, frameTag.attributes);
//     let rulesString = Object.entries(frameTag.styles).map(rule => [`${rule[0]}: ${rule[1]};`]);
//     frameElement.setAttribute('style', rulesString.join(' '));
//     printCodeForTextEditor()
// }

// ['input','change'].forEach(eventType=>document.getElementById('mask-URL').addEventListener(eventType,(evt)=>{
//     frameTag.styles["-webkit-mask-image"] = evt.target.value.length > 0 ? `url(${evt.target.value})` : '';
//     isGazookImage = /gazook89/;
//     isLocalHost = /127.0.0.1/;
//     if(isGazookImage.test(frameTag.styles["-webkit-mask-image"]) && isLocalHost.test(frameTag.styles["-webkit-mask-image"])  === false){
//         delete frameTag.styles[`-webkit-mask-repeat`];
//         delete frameTag.styles[`-webkit-mask-position-x`];  // could possibly be done with one line, deleting only x or y if needed
//         delete frameTag.styles[`-webkit-mask-position-y`];
//     };
//     console.log(evt.target.value);
//     // getRatio(evt.target.value);
//     console.log('bgImgRatio after getRatio: ' + frameTag.meta.bgImgRatio);
//     document.getElementById('frame-size').dispatchEvent(new Event('change'));
//     updateFrameTag();
// }));

// ['input','change'].forEach(eventType=>document.getElementById('frame-size').addEventListener(eventType,(evt)=>{
//     const orientation = pageElement.getBoundingClientRect().height > pageElement.getBoundingClientRect().width ? 'portrait' : 'landscape';

//     const hozInput = document.getElementById('frame-hoz-position');
//     const verInput = document.getElementById('frame-ver-position');
//     // take % value of input and apply it to frames height
//     if(orientation === 'portrait'){
//         frameTag.styles.height = `${Math.round(pageElement.getBoundingClientRect().height * (parseFloat(evt.target.value) / 100))}px`;
        
//         console.log(parseFloat(frameTag.styles.height) * frameTag.meta.bgImgRatio);
//         frameTag.styles.width = parseFloat(frameTag.styles.height) * frameTag.meta.bgImgRatio + 'px';
//     } else {
//         frameTag.styles.width = `${Math.round(pageElement.getBoundingClientRect().width * (parseFloat(evt.target.value) / 100))}px`;
//         frameTag.styles.height = parseFloat(frameTag.styles.width) * frameTag.meta.bgImgRatio + 'px';
//     };
//     evt.target.setAttribute('value', evt.target.value);
//     evt.target.setAttribute('title', evt.target.value + '%');
//     hozInput.min = `${(frameElement.getBoundingClientRect().width + 1) * -1}`;  // the +1 is because of the rounding...without it, it sometimes doesn't allow for shifting completely off page
//     hozInput.max = `${pageElement.getBoundingClientRect().width + 1}`;
//     verInput.min = `${(frameElement.getBoundingClientRect().height + 1) * -1}`;
//     verInput.max = `${pageElement.getBoundingClientRect().height + 1}`;
//     console.log(frameTag.styles.width);
//     updateFrameTag()
// }));

// ['input','change'].forEach(eventType=>document.getElementById('frame-hoz-position').addEventListener(eventType,(evt)=>{
//     frameTag.styles.left = `${Math.round(evt.target.value)}px`;
//     updateFrameTag();
// }));

// ['input','change'].forEach(eventType=>document.getElementById('frame-ver-position').addEventListener(eventType,(evt)=>{
//     frameTag.styles.top = `${Math.round(evt.target.value)}px`;
//     updateFrameTag();
// }));



// function getRatio(image) {
//     const img = new Image();
//     img.addEventListener("load", function(){
//         frameTag.meta.bgImgRatio = Math.round(this.naturalWidth / this.naturalHeight);
//     });
//     img.src = image;
// };


//  PREVIEW PANE TOOLS

function zoomOut() {
    const page = document.getElementById('p1');
    let scale =  page.getBoundingClientRect().width / page.offsetWidth;
    page.style.transformOrigin = 'top center';
    page.style.transform = `scale(${scale - .1})`;

}

function zoomIn() {
    const page = document.getElementById('p1');
    let scale =  page.getBoundingClientRect().width / page.offsetWidth;
    page.style.transformOrigin = 'top center';
    page.style.transform = `scale(${scale + .1})`;

}


// MASK PRESETS

const presetMasks = [
    {
        maskName : 'top-and-left',
        images : [
            {url: undefined, repeat: undefined}
        ]
    },
    {
        maskName : 'top',
        images: [
            {url: window.location.href + 'assets/masks/WC_Horizontal_Top_1_rptX-min.png', repeat: 'x'},
            {url: window.location.href + 'assets/masks/WC_Horizontal_Top_2_rptX-min.png', repeat: 'x'},
            {url: window.location.href + 'assets/masks/WC_Horizontal_Top_3_rptX-min.png', repeat: 'x'},
            {url: window.location.href + 'assets/masks/WC_Horizontal_Top_4_rptX-min.png', repeat: 'x'},
            {url: window.location.href + 'assets/masks/WC_Horizontal_Top_5_rptX-min.png', repeat: 'x'}
        ]
    },
    {
        maskName : 'left',
        images: [
            {url: window.location.href + 'assets/masks/WC_Vertical_Left_1_rptY-min.png', repeat: 'y'},
            {url: window.location.href + 'assets/masks/WC_Vertical_Left_2_rptY-min.png', repeat: 'y'},
            {url: window.location.href + 'assets/masks/WC_Vertical_Left_3-min.png', repeat: null}
        ]
    },
    {
        maskName : 'center',
        images: [
            {url: window.location.href + 'assets/masks/WC_Center_1-min.png', repeat: null},
            {url: window.location.href + 'assets/masks/WC_Center_2-min.png', repeat: null},
            {url: window.location.href + 'assets/masks/WC_Center_3-min.png', repeat: null},
            {url: window.location.href + 'assets/masks/WC_Center_4-min.png', repeat: null}
        ]
    },
    {
        maskName : 'right',
        images: [
            {url: window.location.href + 'assets/masks/WC_Vertical_Right_1_rptY-min.png', repeat: 'y'},
            {url: window.location.href + 'assets/masks/WC_Vertical_Right_2_rptY-min.png', repeat: 'y'},
            {url: window.location.href + 'assets/masks/WC_Vertical_Right_3-min.png', repeat: null}
        ]
    },
    {
        maskName : 'bottom',
        images: [
            {url: window.location.href + 'assets/masks/WC_Horizontal_Bottom_1_rptX-min.png', repeat: 'x'},
            {url: window.location.href + 'assets/masks/WC_Horizontal_Bottom_2_rptX-min.png', repeat: 'x'}
        ]
    }
]

// function setMask(preset) {
//     let maskType = preset.getAttribute('data-coverage');
//     maskType = presetMasks.find(mask => mask.maskName === maskType);
//     specificMaskFile = maskType.images.sample();
//     document.getElementById('mask-URL').value = specificMaskFile.url;
//     if(specificMaskFile.repeat){
//         frameTag.styles[`-webkit-mask-repeat`] = `repeat-${specificMaskFile.repeat}`;
//         frameTag.styles[`-webkit-mask-position-${specificMaskFile.repeat}`] = `${randomInteger(0,800)}px`;
//     } else {
//         delete frameTag.styles[`-webkit-mask-repeat`];
//         delete frameTag.styles[`-webkit-mask-position-x`];  // could possibly be done with one line, deleting only x or y if needed
//         delete frameTag.styles[`-webkit-mask-position-y`];
//     }
//     document.getElementById('mask-URL').dispatchEvent(new Event('change'));

//     updateFrameTag();
// }



// Array.from(document.querySelectorAll('input[type="text"]')).forEach(input=>{input.dispatchEvent(new Event('input'))});
// printCodeForStyleEditor();


