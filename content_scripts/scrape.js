(function () {

    let numberScraped = 0;
    let numberToScrape = 0;

    function scrapeResponse(data) {
        let page = $(data);
        let title = page.find("h3").first().text();
        title = removeBrackets(title);
        let parentDiv = page.find("#kp-notebook-annotations");
        let annotations = [];
        let notes = [];
        parentDiv.children(".a-spacing-base").each(function () {
            child = $(this);
            let annotation = child.find("#highlight").text();
            annotations.push(annotation);
            let note = child.find("#note").text();
            if (note) {
                notes.push(note);
            }
        });
        return {
            title: title,
            annotations: annotations,
            notes: notes
        };
    }

    function removeBrackets(s) {
        // Of course, matching parentheses with a regex is impossible. I hope we don't ever have nested parentheses in a book title.
        let regex = /\s*\([^\(]*\)\s*/g;
        return s.replace(regex, "");
    }

    function getASINs() {
        let parentDiv = $("#kp-notebook-library");
        let asins = [];
        parentDiv.children(".kp-notebook-library-each-book").each(function () {
            asins.push($(this).attr("id"));
        });
        return asins;
    }

    function scrapeASIN(asin) {
        $.get(window.location, { asin: asin, contentLimitState: "" }, function (data) {
            result = scrapeResponse(data);
            if(result.annotations.length) {
                console.log(result);
            }
            numberScraped += 1;
            $("#currentBook").text(numberScraped);
            if(numberScraped == numberToScrape) {
                $("#scrapeModalButton").prop("disabled", false);
            }
        });
    }

    function scrape() {
        $("#scrapeModalButton").prop("disabled", true);
        let asins = getASINs();
        numberToScrape = asins.length;
        $("#numberBooks").text(numberToScrape);
        asins.forEach(function (v,i) {
            scrapeASIN(v);
        });
    }

    function showModal() {
        if (!$("#modal-stuff").length) {
            $("body").append('\
                    <div id="modal-stuff">\
                    <div class="modal fade" id="scrapeModal" tabindex="-1" role="dialog" aria-labelledby="scrapeModalLabel" aria-hidden="true">\
                    <div class="modal-dialog">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                        <h5 class="modal-title" id="scrapeModalLabel">Exporting notes and highlights</h5>\
                        </div>\
                        <div class="modal-body">\
                        Processing <span id="currentBook"></span>/<span id="numberBooks"></span>...\
                        </div>\
                        <div class="modal-footer">\
                        <button type="button" id="scrapeModalButton" class="btn btn-primary" disabled>Close</button>\
                        </div>\
                    </div>\
                    </div></div>\
            </div>');
        }
        $("#scrapeModal").modal({ backdrop: 'static' });
        $("#scrapeModalButton").click(function() {
            $("#scrapeModal").modal("hide");
        });
    }

    showModal();
    scrape();
})();