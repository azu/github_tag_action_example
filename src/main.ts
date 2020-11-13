import * as core from "@actions/core";
import github from "@actions/github";

async function run(): Promise<void> {
    try {
        const token = core.getInput("github_token", {
            required: true
        });
        const octokit = github.getOctokit(token);
        const version: string = core.getInput("version") ?? require("./package.json").version;
        const prefix: string = core.getInput("git_tag_prefix") ?? "";
        const git_commit_sha: string = core.getInput("git_commit_sha", {
            required: true
        });
        const github_repo: string = core.getInput("github_repo", {
            required: true
        });
        const [owner, repo] = github_repo.split("/");
        const gitTagName = `${prefix}${version}`;
        const git = {
            name: github.context.actor,
            email: `${github.context.actor}@users.noreply.github.com`,
            date: new Date().toISOString()
        };
        // logic
        // https://stackoverflow.com/questions/15672547/how-to-tag-a-commit-in-api-using-curl-command
        const res = await octokit.git.createTag({
            tag: gitTagName,
            object: git_commit_sha,
            message: gitTagName,
            type: "commit",
            tagger: git,
            owner,
            repo
        });
        await octokit.git.createRef({
            owner,
            repo,
            sha: res.data.sha,
            ref: `refs/tags/${gitTagName}`
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
