import CryptoJS from 'crypto-js'
import $ from 'jquery'
import CodeMirror from 'codemirror'
import editorWrapper from '../editor/editor'


if ($('#data').length == 0) {
    var data = {
        files: []
    };


    let editor = editorWrapper.createEditor($('#editor')[0], {
        theme: 'material-peacock',
        lineNumbers: true,
        indentUnit: 4,
        autofocus: true,
        lineWrapping: true,
    });

    global.window.CodeMirror = CodeMirror;
    global.window.data = data;
    global.window.editor = editor;

    let selectedFileIndex = 0;

    for (let i in CodeMirror.modeInfo) {
        $('#language')
            .append('<option value="' + i + '">' + CodeMirror.modeInfo[i].name + '</option>');
    }

    $('#new-file').on('click', function () {
        data.files.push({
            'mime': CodeMirror.modeInfo[$('#language option:first').val()].mime,
            'name': 'Untitled ' + (data.files.length + 1),
            'content': '',
        });

        $('#new-file')
            .parent()
            .before('<li class="file-tab"><input type="button" data-index="' + (data.files.length - 1) + '" value="Untitled ' + data.files.length + '"></li>');

        $('.file-tab:last input[type=button]').on('click', function (event) {
            data.files[selectedFileIndex].mime = editor.getOption('mode');
            data.files[selectedFileIndex].name = $('#file-name').val();
            data.files[selectedFileIndex].content = editor.getValue();

            $('.file-tab input[type=button][data-index=' + selectedFileIndex + ']')
                .val(data.files[selectedFileIndex].name);

            let $this = $(this);
            let file = data.files[$this.attr('data-index')];

            selectedFileIndex = $this.attr('data-index');

            $('.file-tab input[type=button]').removeClass('active');
            $this.addClass('active');

            editor.setOption('mode', file.mime);
            $('#file-name').val(file.name);
            editor.setValue(file.content);
        })

        $('.file-tab:last input[type=button]').click();
        $('#language option')[0].selected = true;
    });

    $('#file-name').on('keyup', function (event) {
        $('.file-tab input[type=button].active').val($(event.target).val());
    });

    $('#save').on('click', function (event) {
        data.files[selectedFileIndex].mime = editor.getOption('mode');
        data.files[selectedFileIndex].name = $('#file-name').val();
        data.files[selectedFileIndex].content = editor.getValue();

        let key;
        if ($('.encryption:checked').val() == 'password') {
            key = $('#password').val();
        } else {
            key = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(24));
        }
        let encrypted_data = CryptoJS.AES.encrypt(JSON.stringify(data), key);

        let output_data = {
            encrypted_data: encrypted_data.toString(),
        };

        if ($('[name=expiration]:checked').val() == 'time-expiration') {
            output_data.expiration = $('#destroy-timeout').val();
        } else {
            output_data.expiration = -1;
        }

        $.ajax({
            type: "POST",
            url: "/",
            data: JSON.stringify(output_data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log('test');
                if ($('.encryption:checked').val() == 'password') {
                    window.location.href = window.location.pathname + data.uuid;
                } else {
                    window.location.href = window.location.pathname + data.uuid + '#' + key;
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    })

    $(window).on('resize', function () {
        let height = ($('body').outerHeight(true) - $('#bar').outerHeight(true) + $('#editor')
            .outerHeight() - $('#editor').outerHeight(true)) + 'px'

        $('#editor').css('height', height)
        $('.CodeMirror').css('height', height)
    });

    $('#language').on('change', function () {
        let id = Number.parseInt($(this).val());
        editor.setLanguage(id, function () {
            data.files[selectedFileIndex].mime = CodeMirror.modeInfo[id].mime;
        });
    });

    $('#password').on('keypress', function () {
        $('.encryption[value=password]').click();
    });

    $('#switch-vim-mode').on('click', function () {
        if (editor.getOption('keyMap') != 'vim') {
            $.getScript('/static/codemirror/vim.min.js', function () {
                editor.setOption('keyMap', 'vim');
            });
            $(this).addClass('active');
            localStorage.setItem('settings.editor.keymap', 'vim');
        } else {
            editor.setOption('keyMap', 'default');
            $(this).removeClass('active');
            localStorage.removeItem('settings.editor.keymap');
        }
    });

    $('#new-file').click();

    $('#language').change();

    $(window).resize();
}
