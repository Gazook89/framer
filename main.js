

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
        const element = document.getElementById('framed-image');
        initMove(evt, element)
    }

    render(){
        const imgElement = Object.assign(document.createElement('img'), {id: this.name, className: 'framed-image', alt: this.altText, src: this.url});
        imgElement.addEventListener('mousedown', this.initMoveImage)
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




const frame = new Frame('lava', `assets/masks/WC_Vertical_Right_1_rptY-min.png`);
frame.render();

const image = new Image('lava', `https://images.unsplash.com/photo-1475598322381-f1b499717dda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80`, 'here is my photo');
image.render();


document.getElementById('image-control').addEventListener('click', (evt)=>{
    document.getElementsByClassName('active')[0].classList.remove('active');
    evt.target.classList.add('active');
    document.getElementById('url-input').value = image.url;
    transformOverlay(document.querySelector('.framed-image'));

})




function transformOverlay(targetElement, mask) {
    document.querySelector('.overlay')?.remove();
    const overlay = new (function() {
        this.top = targetElement.offsetTop + targetElement.parentElement.offsetTop + targetElement.parentElement.parentElement.offsetTop ;
        // this.right = targetElement.offsetLeft + targetElement.offsetWidth;   // don't think is needed or wanted?
        // this.bottom = targetElement.offsetTop + targetElement.offsetHeight;  // don't think is needed or wanted?
        this.left = targetElement.offsetLeft + targetElement.parentElement.offsetLeft + targetElement.parentElement.parentElement.offsetLeft;
        this.width = targetElement.offsetWidth;
        this.height = targetElement.offsetHeight;
    });

    if(mask){
        overlay.top += targetElement.style.maskPosition ? parseInt(targetElement.style.maskPosition.match(/(-?\d*).*\s(-?\d*)/)[2]) : 0;
        overlay.left += targetElement.style.maskPosition ? parseInt(targetElement.style.maskPosition.match(/(-?\d*).*\s(-?\d*)/)[1]) : 0;
        // overlay.width = targetElement.style.maskPosition ? 

    }
    

    const handles = 
    [
        scale = {id: 'scale', top:-30, left: -30},
        topLeft = {id: 'top-left-handle', top: -7, left: -7},
        topRight = {id: 'top-right-handle', top: -7, right: -7},
        bottomRight = {id: 'bottom-right-handle', bottom: -7, right: -7},
        bottomLeft = {id: 'bottom-left-handle', bottom: -7, left: -7}
    ];

    function createOverlayBox() {
        const overlayBox = Object.assign(document.createElement('div'), {className:'overlay'});
        ['top', 'left', 'width', 'height'].forEach(property=>{
            overlayBox.style[property] = overlay[property] + 'px';
        });
        if(mask != true){createHandles(overlayBox)};
        overlayBox.addEventListener('mousedown', mask == true ? shiftMask : initMove);
        return overlayBox;
    }

    function createHandles(overlayBox) {
        handles.forEach(handle=>{
            const handleElement = Object.assign(document.createElement('div'), {id: handle.id, className:'handle'});
            Object.keys(handle).forEach(property=>{
                handleElement.style[property] = handle[property] + 'px';
            });
            if(handle.id == 'scale'){
                handleElement.addEventListener('mousedown', resize);
            } else {
                handleElement.addEventListener('mousedown', resize);
            }
            overlayBox.append(handleElement)
        })

    }

    function shiftMask(evt) {
        // todo:  need a way to be able to shift mask-position on the .frame element.  So the frame element stays in the same place, but the mask inside can be moved around.
        // possibly a third button down with Frame and Image in the toolbar, "Mask".  Or maybe it's holding "Shift" key while in Frame mode.
        // should highlight and unclip the mask when activated.
        evt.preventDefault();
        evt.stopPropagation();

        document.getElementById('preview-hover-area').style.display = 'none';

        const overlayBox = evt.target;
        const page = document.getElementsByClassName('page')[0];
    
        let shiftX = evt.clientX - overlayBox.offsetLeft;
        let shiftY = evt.clientY - overlayBox.offsetTop;

        overlayBox.style.zIndex = 500;
        overlayBox.style.background = 'red';
        overlayBox.style.opacity = .3;
        page.style.overflow = 'unset';

        let maskPos;
        if(targetElement.style.maskPosition){
            const maskRegex = targetElement.style.maskPosition.match(/(-?\d*).*\s(-?\d*)/);
            maskPos = [parseInt(maskRegex[1]), parseInt(maskRegex[2])];
        } else {
            maskPos = [0, 0]
        };

        moveAt(evt.pageX, evt.pageY, evt.movementX, evt.movementY);

        function moveAt(pageX, pageY, movementX, movementY) {
            
            overlayBox.style.left = pageX - shiftX  + 'px';
            overlayBox.style.top = pageY - shiftY  + 'px';

            maskPos[0] = maskPos[0] + movementX ;
            maskPos[1] = maskPos[1] + movementY ;
            targetElement.style.maskPosition = `${maskPos[0]}px ${maskPos[1]}px`;
        }
    
        function onMouseMove(evt) {
            moveAt(evt.pageX, evt.pageY, evt.movementX, evt.movementY);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
            overlayBox.style.zIndex = null;
            overlayBox.style.opacity = null;
            overlayBox.style.background = null;
            page.style.overflow = 'clip';
    
            document.getElementById('preview-hover-area').style.display = 'flex';
    
        }
        
    }



    function initMove(evt){
        evt.preventDefault();
        evt.stopPropagation();
    

        document.getElementById('preview-hover-area').style.display = 'none';
    
        const overlayBox = evt.target;
        const page = document.getElementsByClassName('page')[0];
    
        let shiftX = evt.clientX - overlayBox.offsetLeft;
        let shiftY = evt.clientY - overlayBox.offsetTop;

        let frameShiftY = targetElement.className == 'framed-image' ? targetElement.parentElement.offsetTop  : 0 ;
        let frameShiftX = targetElement.className == 'framed-image' ? targetElement.parentElement.offsetLeft  : 0 ;
    
        overlayBox.style.zIndex = 500;
        overlayBox.style.opacity = .5;
        page.style.overflow = 'unset';
    
        moveAt(evt.pageX, evt.pageY);

        function moveAt(pageX, pageY) {
            overlayBox.style.left = pageX - shiftX  + 'px';
            overlayBox.style.top = pageY - shiftY  + 'px';
            targetElement.style['top'] = parseFloat(overlayBox.style.top) - page.offsetTop - frameShiftY + 'px';
            targetElement.style['left'] = parseFloat(overlayBox.style.left) - page.offsetLeft - frameShiftX + 'px';
        }
    
        function onMouseMove(evt) {
            moveAt(evt.pageX, evt.pageY);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
            overlayBox.style.zIndex = null;
            overlayBox.style.opacity = null;
            page.style.overflow = 'clip';
    
            document.getElementById('preview-hover-area').style.display = 'flex';
    
        }
    
    }


 

    function resize(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const handle = evt.target;
        const overlayBox = handle.parentElement;
        let startWidth = targetElement.width;
        let startHeight = targetElement.height;
        let aspectRatio = startHeight / startWidth;

        const shiftX = evt.clientX - handle.getBoundingClientRect().left;
        const shiftY = evt.clientY - handle.getBoundingClientRect().top;
        

        moveAt(evt.pageX, evt.pageY, evt.movementX, evt.movementY);

        function moveAt(pageX, pageY, movementX, movementY) {

            if(handle.id.includes('left') || handle.id.includes('scale')){
                overlayBox.style.width =  parseFloat(overlayBox.style.width) - movementX + 'px';
                console.log(handle.offsetLeft);
                overlayBox.style.left = pageX - shiftX - handle.offsetLeft  - document.getElementById('right-pane').offsetLeft + document.getElementById('right-pane').scrollLeft + 'px';

            } else {
                overlayBox.style.width =  parseFloat(overlayBox.style.width) + movementX + 'px';
            }

            if(handle.id === 'scale'){
                overlayBox.style.height = parseFloat(overlayBox.style.width) * aspectRatio + 'px';
                overlayBox.style.top = parseFloat(overlayBox.style.top) + (movementX * aspectRatio) + 'px';  
                targetElement.style.height = overlayBox.offsetHeight + 'px';
                
            } else {
                if(handle.id.includes('top')){
                    overlayBox.style.height =  parseFloat(overlayBox.style.height) - movementY + 'px';
                    overlayBox.style.top = pageY + document.getElementById('right-pane').scrollTop + 'px';
                } else {
                    overlayBox.style.height =  parseFloat(overlayBox.style.height) + movementY + 'px';
                }
                
                targetElement.style['height'] = overlayBox.style.height;
            }



            targetElement.style['width'] = overlayBox.style.width;
            targetElement.style['top'] = parseFloat(overlayBox.style.top) - 50 + 'px';
            targetElement.style['left'] = parseFloat(overlayBox.style.left) - 60 + 'px';
        }
    
        function onMouseMove(evt) {
            moveAt(evt.pageX, evt.pageY, evt.movementX, evt.movementY);            

        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            handle.onmouseup = null;
            
        }
    }

    document.getElementById('right-pane').append(createOverlayBox());
}



document.getElementById('frame-control').addEventListener('click', (evt)=>{
    document.getElementsByClassName('active')[0].classList.remove('active');
    evt.target.classList.add('active');
    document.getElementById('url-input').value = frame.url;
    transformOverlay(document.querySelector('.frame'));
})

document.getElementById('mask-control').addEventListener('click', (evt)=>{
    document.getElementsByClassName('active')[0].classList.remove('active');
    evt.target.classList.add('active');
    document.getElementById('url-input').value = frame.url;
    transformOverlay(document.querySelector('.frame'), true);
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

document.getElementById('name-input').addEventListener('click', (evt)=>{
    if(evt.target.selectionEnd > evt.target.value.length - 6){
        evt.target.setSelectionRange(evt.target.selectionStart, evt.target.value.length - 6)
    }
})

document.getElementById('name-input').addEventListener('input', (evt)=>{
    evt.target.value = evt.target.value.split(' ').join('-');
    document.querySelector('.framed-image').id = evt.target.value;
    document.querySelector('.frame').id = `${evt.target.value}-frame`;
    const regMatch = evt.target.value.match(/(.*)(-frame)/);
    
    evt.target.value = regMatch ? `${regMatch[1]}-frame` : evt.target.value + '-frame';
    evt.target.setSelectionRange(evt.target.selectionStart, evt.target.value.length - 6)
    frame.name = evt.target.value;
    image.name = evt.target.value;
})

let observer = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation=>{
        console.log(mutation.target);
    })
})

observer.observe(document.querySelector('.frame'), {
    childList: true,
    subtree: true,
    attributes: true
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
    if(document.querySelector('.overlay')){
        document.querySelector('.overlay').style.transformOrigin = 'top center';
        document.querySelector('.overlay').style.transform = `scale(${scale - .1})`
    } 


}

function zoomIn() {
    const page = document.getElementById('p1');
    let scale =  page.getBoundingClientRect().width / page.offsetWidth;
    page.style.transformOrigin = 'top center';
    page.style.transform = `scale(${scale + .1})`;
    if(document.querySelector('.overlay')){
        document.querySelector('.overlay').style.transformOrigin = 'top center';
        document.querySelector('.overlay').style.transform = `scale(${scale + .1})`
    } 
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


