var $ = require('jquery'),
    editorWrapper = require('../editor/editor');

require('remodal');


if ($('#data').length != 0) {
    let data = JSON.parse($('#data').val())

    if (Number.parseInt(data['expiration']) == -1) {
        $('#destroyed-warning').css('visibility', 'visible');
    }

    let initializeEditor = function (decryptionKey) {
        data = JSON.parse(CryptoJS.AES.decrypt(data.encrypted_data, decryptionKey)
                                  .toString(CryptoJS.enc.Utf8));

        let editor = editorWrapper.createEditor($('#editor')[0], {
            theme: 'material-peacock',
            lineNumbers: true,
            indentUnit: 4,
            readOnly: true,
            cursorBlinkRate: -1, // Hide cursor
            lineWrapping: true,
        });

        global.window.data = data;
        global.window.editor = editor;

        if (data.files.length > 1) {
            $('#editor').css('height', 'calc(100% - 41px)');

            for (let i = 0; i < data.files.length; i++) {
                $('#file-tabs')
                    .append('<li class="file-tab"><input type="button" data-index="' + i + '" value="' + data.files[i].name + '"></li>')

                $('.file-tab:last input[type=button]').on('click', function (event) {
                    let $this = $(this);
                    let file = data.files[$this.attr('data-index')];


                    $('.file-tab input[type=button].active').removeClass('active');
                    $this.addClass('active');

                    editor.setLanguage(file.mime, function () {
                        editor.setValue(file.content);
                    });
                })
            }

            $('.file-tab:first input[type=button]').click()
        } else {
            $('#editor').css('height', '100%');
            $('#editor').css('margin-top', '0');
            $('html').css('margin-top', '0');
            $('body').css('margin-top', '0');


            editor.setLanguage(data.files[0].mime, function () {
                editor.setValue(data.files[0].content);
            });
        }
    }


    if (window.location.hash.length != 0) {
        let decryptionKey = window.location.hash.substr(1, window.location.hash.length - 1);
        initializeEditor(decryptionKey);
    } else {
        $(function () {
            let modal = $('[data-remodal-id=decrypt]').remodal();
            modal.open();

            $('[data-remodal-id=decrypt]').on('confirmation', function () {
                initializeEditor($('#decryption-key').val());
            });

            $('#decryption-key').on('keydown', function (e) {
                if (e.which == 13) {
                    $("button[data-remodal-action='confirm']").click();
                }
            });
        });
    }
}
