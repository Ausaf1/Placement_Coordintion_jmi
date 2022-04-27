$(document).ready(function() {
    $(window).scroll(function() {
        // sticky navbar
        if (this.scrollY > 20) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        } // scroll-up button
        if (this.scrollY > 500) {
            $(".scroll-up-btn").addClass("show");
        } else {
            $(".scroll-up-btn").removeClass("show");
        }
    });

    // slide-up script
    $(".scroll-up-btn").click(function() {
        $("html").animate({ scrollTop: 0 });
        $("html").css("scrollBehavior", "auto");
    });
    $(".navbar .menu li a").click(function() {
        //smooth scroll
        $("html").css("scrollBehavior", "smooth");
    }); // toggle menu
    $(".menu-btn").click(function() {
        $(".navbar .menu").toggleClass("active");
        $(".menu-btn i").toggleClass("active");
    });
});

$('#button-a').click(function() {
    var name = $('#name').val();
    var email = $('#email').val();
    var message = $('#message').val();
    if (name == "" || email == "" || message == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all the fields',
        })
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Successfully submitted',
            text: 'Thank you for your message',
        })
    }
});

const navLinks = document.querySelectorAll('.nav-item')
const menuToggle = document.getElementById('navbarSupportedContent')
const bsCollapse = new bootstrap.Collapse(menuToggle)
navLinks.forEach((l) => {
    l.addEventListener('click', () => { bsCollapse.toggle() })
});