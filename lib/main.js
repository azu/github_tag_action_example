"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const tag_1 = require("./tag");
function run() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput("github_token", {
                required: true
            });
            const octokit = github_1.default.getOctokit(token);
            const version = (_a = core.getInput("version")) !== null && _a !== void 0 ? _a : require("./package.json").version;
            const prefix = (_b = core.getInput("git_tag_prefix")) !== null && _b !== void 0 ? _b : "";
            const git_commit_sha = core.getInput("git_commit_sha", {
                required: true
            });
            const github_repo = core.getInput("github_repo", {
                required: true
            });
            const [owner, repo] = github_repo.split("/");
            const gitTagName = `${prefix}${version}`;
            yield tag_1.tag(octokit, {
                owner,
                repo,
                gitName: github_1.default.context.actor,
                gitEmail: `${github_1.default.context.actor}@users.noreply.github.com`,
                gitTagName,
                gitCommitSha: git_commit_sha,
                gitCommitMessage: `chore(release): ${gitTagName}`,
                gitDate: new Date().toISOString()
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();