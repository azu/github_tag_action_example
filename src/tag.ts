import * as core from "@actions/core";
import github from "@actions/github";

export const tag = async (
    octokit: ReturnType<typeof github.getOctokit>,
    options: {
        gitTagName: string;
        gitCommitSha: string;
        gitCommitMessage: string;
        gitName: string;
        gitEmail: string;
        gitDate: string;
        owner: string;
        repo: string;
    }
) => {
    core.debug("options:" + JSON.stringify(options, null, 4));
    // logic
    try {
        await octokit.git.getRef({
            owner: options.owner,
            repo: options.repo,
            ref: `refs/tags/${options.gitTagName}`
        });
        core.debug("already tagged");
        return; // already tagged
    } catch (error) {
        // https://stackoverflow.com/questions/15672547/how-to-tag-a-commit-in-api-using-curl-command
        const tagRes = await octokit.git.createTag({
            tag: options.gitTagName,
            object: options.gitCommitSha,
            message: options.gitTagName,
            type: "commit",
            tagger: {
                name: options.gitName,
                email: options.gitEmail,
                date: options.gitDate
            },
            owner: options.owner,
            repo: options.repo
        });
        core.debug("create tag" + JSON.stringify(tagRes));
        const refRes = await octokit.git.createRef({
            owner: options.owner,
            repo: options.repo,
            sha: tagRes.data.sha,
            ref: `refs/tags/${options.gitTagName}`
        });
        core.debug("creat ref to tag:" + JSON.stringify(refRes));
    }
};
