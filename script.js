document.addEventListener('DOMContentLoaded', function() {
    // Navbar blur effect on scroll
    window.addEventListener('scroll', function() {
        var navbar = document.getElementById('navbar');
        if (window.pageYOffset > 0) {
            navbar.classList.add('blur');
        } else {
            navbar.classList.remove('blur');
        }
    });

    // Atropos Initialization with Debugging
    var atroposElements = document.querySelectorAll('.my-atropos');
    
    console.log('Atropos elements found:', atroposElements.length); // Debugging line

    atroposElements.forEach(function (element) {
        console.log('Initializing Atropos for element:', element); // Debugging line
        Atropos({
            el: element,
            rotateXMax: 20,
            rotateYMax: 20,
            rotateTouch: 2
            // Additional options can be added here
        });
    });
});
document.querySelectorAll('.my-atropos').forEach(element => {
    if (!element.querySelector('.atropos-rotate') || !element.querySelector('.atropos-inner')) {
        console.error('Missing Atropos structure in:', element);
    }
});