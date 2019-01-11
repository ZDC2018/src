/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin } from 'built-in';
import { WxgamePlugin } from './wxgame/wxgame';
import { SubPackagePlugin } from './wxgame/subpackage'
import { CustomPlugin } from './myplugin';
import * as defaultConfig from './config';

const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_wxgame`;
        if (command == 'build') {
            return {
                outputDir,
                commands: [
                    // new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CleanPlugin({ matchers: ["js", "resource", 'stage1'] }),
                    // new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true} }),                     
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    // new ManifestPlugin({ output: 'manifest.js' })
                    new SubPackagePlugin({
                            output: 'manifest.js',
                            subPackages: [
                                {
                                     root: "resource/res/",
                                    "includes": [],
                                }
                            ]
                        })
                ]
            }
        }
        else if (command == 'publish') {
            return {
                outputDir,
                commands: [
                    // new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CleanPlugin({ matchers: ["js", "resource", 'stage1'] }),
                    // new CompilePlugin({ libraryType: "debug", defines: { DEBUG: false, RELEASE: true } }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true} }), 
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }
                    ]),
                    // new ManifestPlugin({ output: 'manifest.js' })
                    new SubPackagePlugin({
                        output: 'manifest.js',
                        subPackages: [
                            {
                                    root: "resource/res/",
                                    "includes": [],
                            }
                        ]
                    })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
