// The whole document is a component. <html>, <head> and all.
// `children` is just another prop -- the one JSX fills in from the tag body.
export function Layout({ title, children }) {
	return (
		<html>
			<head>
				<title>{title}</title>
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
				<link rel="stylesheet" href="/main.css" />
			</head>
			<body>
				<div className="container">{children}</div>
			</body>
		</html>
	);
}
