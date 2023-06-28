export function getDistinctSecondHighestPaths(paths: string[]): Set<string> {

    let roots: Set<string> = new Set<string>()
    paths.forEach(path => {
        let segments = path.split("/")
        roots.add(segments[0])
    });

    return roots;
}
