var $ = require('jquery'),
    CodeMirror = require('codemirror');

require('codemirror/mode/meta');
require('codemirror/addon/mode/multiplex');
require('codemirror/addon/mode/simple');
require('codemirror/addon/mode/overlay');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/search');

global.window.CodeMirror = CodeMirror;

module.exports.createEditor = function (element, options) {
    let editor = CodeMirror(element, options);

    let recursion = 0;
    let loadModesWithDependencies = function (modeName, callback) {
        $.getScript('/static/codemirror/' + modeName + '/' + modeName + '.min.js', function () {
            if (CodeMirror.modes[modeName] && CodeMirror.modes[modeName].dependencies !== undefined) {
                for (let i in CodeMirror.modes[modeName].dependencies) {
                    loadModesWithDependencies(CodeMirror.modes[modeName].dependencies[i], callback);
                    recursion++;
                }
            }

            recursion--;

            if (recursion == -1) {
                recursion++;
                callback && callback();
            }
        });
    }

    editor.setLanguage = function (language, callback) {
        let mode = null;
        let mime = null;
        if (Number.isInteger(language)) {
            mode = CodeMirror.modeInfo[language].mode;
            mime = CodeMirror.modeInfo[language].mime;
        } else {
            // Is mime type...
            for (let m in CodeMirror.modeInfo) {
                if (CodeMirror.modeInfo[m].mime == language) {
                    mode = CodeMirror.modeInfo[m].mode;
                    mime = CodeMirror.modeInfo[m].mime;
                }
            }
        }

        if (mode != 'null') {
            loadModesWithDependencies(mode, function () {
                callback && callback();
                editor.setOption('mode', mime);
            });
        } else {
            callback && callback();
            editor.setOption('mode', mime);
        }
    }

    return editor;
}
