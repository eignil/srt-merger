
var srt = require("./lib/srt_parser.js")
var fs = require("fs")
var path = require("path")

let electron = require('electron');

const { ipcRenderer } = electron;
const { dialog } = electron.remote;

document.getElementById('selectFirstSrtFile').addEventListener('click', function(e) {
    let show_content = document.getElementById('firstSrtFileContent')
    openFile(show_content)

},false);

document.getElementById('selectSecondSrtFile').addEventListener('click', function(e) {
    let show_content = document.getElementById('secondSrtFileContent')
    openFile(show_content)

},false);

document.getElementById('mergeSrtFile').addEventListener('click', function(e) {
    let show_content = document.getElementById('mergedSrtFileContent')
    let firstContent = document.getElementById('firstSrtFileContent').value
    let secondContent = document.getElementById('secondSrtFileContent').value
    show_content.innerText = merge_srt_file(firstContent,secondContent)

},false);

document.getElementById('saveMergedSrtFile').addEventListener('click', function(e) {
    let show_content = document.getElementById('mergedSrtFileContent')
    saveFile(show_content.value)
},false);


function  openFile (show_content){
    // 打开选择文件对话框,非模态
    dialog.showOpenDialog(null, {
        // 选择文件, 隐藏文件也显示出来
        properties: ['openFile', 'showHiddenFiles'],
        // 后缀为html, js, json, md其中之一
        filters: [{
            name: 'Text',
            extensions: ['srt', 'txt']
        }]
    }, function(filenames) {

        // filenames是一个数组, 每一项为选择的文件的绝对路径
        let firstFile = filenames[0]
            //fileContentEle = document.getElementById('fileContent');

        if (firstFile) {
            fs.readFile(firstFile, 'utf8', function(err, data) {
                if (err) {
                    // 如果读取错误, 弹出错误提示窗口
                    dialog.showErrorBox('error', `read ${firstFile} error`);
                    return;
                }
                //console.log(data)
                if (show_content) {
                  show_content.innerText = data;
                }
            });
        }
    });
}

function saveFile(save_data){
     dialog.showSaveDialog(null,{
         filters:[{
             name: 'Merged',
             extensions:['srt','txt']
         }]
     },function (filename){
         if (filename){
             fs.writeFile(filename,save_data,'utf-8',function(err){
                 "use strict";
                 if (err) {
                     // 如果写错误, 弹出错误提示窗口
                     dialog.showErrorBox('error', `write ${filename} error ${err}`);
                     return;
                 }
             })
         }
     })
}

function merge_srt_file(firstSrtData, secondSrtData) {
    let firstData = srt.fromString("first",firstSrtData)
    let secondData = srt.fromString("second",secondSrtData)

    var data = srt.merge(firstData,secondData)

    return srt.toString(data)
}



