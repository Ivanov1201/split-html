pageWidth = 794;
pageHeight = 1123 - 50;
let cv_wrapper;
let original_page_wrapper;
current_height = 0;
currnet_page_index = 0;
total = 0;

function create_page(content) {
    const page_wrapper = document.createElement('div');
    page_wrapper.classList.add('new-page-wrapper', 'a4');
    page_wrapper.setAttribute("id", "page_"+currnet_page_index);
        const left_blog = document.createElement('div');
        left_blog.classList.add('left-blog');
        // The main contents of left-blog goes here
        left_blog.innerHTML = content.innerHTML;
        //
        const right_blog = document.createElement('div');
        right_blog.classList.add('right-blog', 'template_color');
        const outer_page = document.createElement('div');
        outer_page.classList.add('outer-page');
        outer_page.appendChild(left_blog);
        outer_page.appendChild(right_blog);
    page_wrapper.appendChild(outer_page);
    cv_wrapper.appendChild(page_wrapper);
    currnet_page_index ++;
    current_height = 0;
}

function split() {
    cv_wrapper = document.getElementsByClassName('cv-wrapper')[0];
    original_page_wrapper = document.getElementsByClassName('page-wrapper')[0];
    const original = original_page_wrapper.getElementsByClassName('outer-page')[0].getElementsByClassName('left-blog')[0]; // all children of original page
    let error_flag = false;
    while (original.children.length != 0 && !error_flag) {
        let content = document.createElement('div');
        Array.from(original.children).every(function (element) {
            if (current_height + $(element).outerHeight(true) <= pageHeight) { // This is the case when the element can be put on the current page
                console.log(current_height, $(element).outerHeight(true), element.getAttribute("data-section"))
                content.appendChild(element.cloneNode(true));
                current_height += $(element).outerHeight(true);
                element.remove();
                return true;
            } else if (element.children.length){ // This is the case when the whole element can not be put on the current page : in this case the children of the element should be divided
                let child_content = element.cloneNode(false);
                Array.from(element.children).every(function (child_element) { // iterate the children and figure out what sub-elements can be put on the current page
                    if (current_height + $(child_element).outerHeight(true) <= pageHeight) {
                        child_content.appendChild(child_element.cloneNode(true));
                        current_height += $(child_element).outerHeight(true);
                        child_element.remove();
                        return true;
                    } else if (child_element.children.length){ // This is the case when the whole element can not be put on the current page : in this case the children of the element should be divided
                        let grand_child_content = child_element.cloneNode(false);
                        Array.from(child_element.children).every(function (grand_child_element) { // iterate the children and figure out what sub-elements can be put on the current page
                            if (current_height + $(grand_child_element).outerHeight(true) <= pageHeight) {
                                grand_child_content.appendChild(grand_child_element.cloneNode(true));
                                current_height += $(grand_child_element).outerHeight(true);
                                grand_child_element.remove();
                                return true;
                            } else {
                                if ($(grand_child_element).outerHeight(true) > pageHeight) { // this is the case when the height of sub-element goes over the Maxim height of A4.
                                    // The code can be updated to accept to divide the sub-element. And the design can be updated
                                    alert("The design should be updated");
                                    error_flag = true;
                                    return false;
                                }
                                return false;
                            }
                        });
                        child_content.appendChild(grand_child_content);
                        return false;
                    } else { // this is the case when not-dividable part goes over the height of A4 pager. THE DESIGN should be ...
                        alert("The design should be updated");
                        error_flag = true;
                        return false;
                    }
                });
                content.appendChild(child_content);
                return false;
            } else { // this is the case when not-dividable part goes over the height of A4 pager. THE DESIGN should be ...
                alert("The design should be updated");
                error_flag = true;
                return false;
            }
        });
        create_page(content);
    }
    original_page_wrapper.remove();
}