

const outputPreview = document.getElementById('output');
const textCode = document.getElementById('text-code');
const textCode2 = document.getElementById('text-code2');

const styleCode = document.getElementById('style-code');
const pageElement = document.getElementsByClassName('page')[0];

styleCode.value = [
    `.mask {`,
    `    position:absolute;`,
    `    mask-repeat: no-repeat;`,
    `    mask-size: 100% 100%;`,
    `}`,
    ``,
    `.mask img {`,
    `    position: absolute;`,
    `}`
    
].join('\n')



// IMAGE

class Image {
    constructor(name, url, altText){
        this.name = name,
        this.url = url,
        this.altText = altText
    }

    render(){
        const imgElement = Object.assign(document.createElement('img'), {id: this.name, className: 'masked-image', alt: this.altText, src: this.url});
        document.getElementsByClassName('mask')[0].append(imgElement);
        imgElement.style.width = '100%';
        imgElement.setAttribute('draggable', false);

    }
}

class Frame {
    constructor(name, url){
        this.name = name,
        this.url = url
    }

    render(){
        const frameElement = Object.assign(document.createElement('div'), {id: `${this.name}-mask`, className: `mask`});
        frameElement.style.maskImage = `url(${this.url})`;
        frameElement.style.width = '100%';
        frameElement.style.height = '100%';
        document.getElementById('p1').append(frameElement);

        document.getElementById('url-input').addEventListener('change', this.updateFrame)
        
    }
    
}




const frame = new Frame('forest-path', `assets/masks/WC_Vertical_Right_1_rptY-min.png`);
frame.render();

const image = new Image('forest-path', `https://images.unsplash.com/photo-1550100136-e092101726f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80`, 'an illustration');
image.render();



function transformOverlay(targetElement, mask) {
    document.querySelector('.overlay')?.remove();
    const overlay = new (function() {
        this.top = targetElement.offsetTop + targetElement.parentElement.offsetTop + targetElement.parentElement.parentElement.offsetTop ;
        this.left = targetElement.offsetLeft + targetElement.parentElement.offsetLeft + targetElement.parentElement.parentElement.offsetLeft;
        this.width = targetElement.offsetWidth;
        this.height = targetElement.offsetHeight;
    });

    if(mask){
        overlay.top += targetElement.style.maskPosition ? parseInt(targetElement.style.maskPosition.match(/(-?\d*).*\s(-?\d*)/)[2]) : 0;
        overlay.left += targetElement.style.maskPosition ? parseInt(targetElement.style.maskPosition.match(/(-?\d*).*\s(-?\d*)/)[1]) : 0;
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

        let frameShiftY = targetElement.className == 'masked-image' ? targetElement.parentElement.offsetTop  : 0 ;
        let frameShiftX = targetElement.className == 'masked-image' ? targetElement.parentElement.offsetLeft  : 0 ;
    
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
        

        let frameShiftY = targetElement.className == 'masked-image' ? targetElement.parentElement.offsetTop  : 0 ;
        let frameShiftX = targetElement.className == 'masked-image' ? targetElement.parentElement.offsetLeft  : 0 ;

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
            targetElement.style['top'] = parseFloat(overlayBox.style.top) - frameShiftY - 50 + 'px';
            targetElement.style['left'] = parseFloat(overlayBox.style.left) - frameShiftX -60 + 'px';
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
    if(evt.target.classList.contains('active')){
        document.querySelector('.overlay').remove();
        evt.target.classList.remove('active')
    } else {
        document.getElementsByClassName('active')[0]?.classList.remove('active');
        evt.target.classList.add('active');
        document.getElementById('url-input').value = frame.url;
        transformOverlay(document.querySelector('.mask'));

    };
})

document.getElementById('mask-control').addEventListener('click', (evt)=>{
    if(evt.target.classList.contains('active')){
        document.querySelector('.overlay').remove();
        evt.target.classList.remove('active')
    } else {
        document.getElementsByClassName('active')[0]?.classList.remove('active');
        evt.target.classList.add('active');
        document.getElementById('url-input').value = frame.url;
        transformOverlay(document.querySelector('.mask'), true);

    };
})

document.getElementById('image-control').addEventListener('click', (evt)=>{
    if(evt.target.classList.contains('active')){
        document.querySelector('.overlay').remove();
        evt.target.classList.remove('active')
    } else {
        document.getElementsByClassName('active')[0]?.classList.remove('active');
        evt.target.classList.add('active');
        document.getElementById('url-input').value = image.url;
        transformOverlay(document.querySelector('.masked-image'));
    

    };
})


document.getElementById('url-input').addEventListener('input', (evt)=>{
    const activeControl = document.querySelector('.active')?.id;
    if(activeControl === ('frame-control' || 'mask-control')){
        document.querySelector('.mask').style.maskImage = `url(${evt.target.value}`;
        frame.url = evt.target.value;
    } else if(activeControl === 'image-control') {
        document.querySelector('.masked-image').src = evt.target.value;
        document.querySelector('.masked-image').style.width = '100%';
        image.url = evt.target.value;
    } else {
        return
    }
    
})

document.getElementById('name-input').addEventListener('click', (evt)=>{
    if(evt.target.selectionEnd > evt.target.value.length - 6){
        evt.target.setSelectionRange(evt.target.selectionStart, evt.target.value.length - 5)
    }
})

document.getElementById('name-input').addEventListener('input', (evt)=>{
    evt.target.value = evt.target.value.split(' ').join('-');
    const regMatch = evt.target.value.match(/(.*)(-mask)/);
    
    evt.target.value = regMatch ? `${regMatch[1]}-mask` : evt.target.value + '-mask';
    document.querySelector('.masked-image').id = regMatch[1];
    document.querySelector('.mask').id = `${evt.target.value}`;
    evt.target.setSelectionRange(evt.target.selectionStart, evt.target.value.length - 5);
})


const markdown = {};

let observer = new MutationObserver(mutationRecords => {
    const textEditor = document.getElementById('text-code');
    let styles = [];
    mutationRecords.forEach(mutation=>{
        Object.values(mutation.target.style).forEach(prop=>{
            const propKeyValue = prop + ':' + mutation.target.style[prop].replace(/"/g, '');
            styles.push(propKeyValue);
        });
        if(mutation.target.className === 'masked-image'){
            markdown.img = `![${mutation.target.id}](${mutation.target.src}){${mutation.target.className},${styles.join(',')}}`;
        } else {
            markdown.frame = `#${mutation.target.id},${mutation.target.className},${styles.join(',')}`;
        }
        textEditor.value = [
            `{{${markdown.frame}`,
            `${markdown.img}`,
            `}}`
        ].join('\n');
    })
})

observer.observe(document.querySelector('.mask'), {
    attributes: true
})

observer.observe(document.querySelector('.masked-image'), {
    attributes: true
})



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

