import { Layout } from './Layout.jsx';

function Review({ review }) {
	return (
		<div className="card w-100 mt-3">
			<div className="card-header">
				<em>{review.author}</em>
			</div>
			<div className="card-body">
				<p>{review.content}</p>
			</div>
		</div>
	);
}

// `values` and `errors` default to empty, so the GET route can ignore them
// entirely and only the failed-POST path has to pass anything.
export function ItemView({ item, reviews, values = {}, errors = {} }) {
	return (
		<Layout title="Incredibly Simple Shopping">
			<div className="pb-2 mt-4 mb-2 border-bottom">
				<h1>{item.name}</h1>
				<p>
					(<a href="/items">back</a>)
				</p>
			</div>

			<div className="row">
				<div className="col-4">
					<img className="img-fluid" src={item.image_url} />
				</div>
				<div className="col-4">
					<div>{item.description}</div>
					<div>
						<em>${item.cost}</em>
					</div>
				</div>
			</div>

			<div className="row my-4">
				<div className="col-8">
					<h3>Reviews</h3>

					<div className="card w-100 mt-3">
						<div className="card-body">
							{/* No action attribute needed -- a form posts to the URL it is on.
							    One URL, two methods: GET renders it, POST changes it. */}
							<form method="POST">
								<div className="form-group">
									<label>Add your review!</label>
									{/* defaultValue, not value: with no JavaScript on the page every
									    input is uncontrolled. React only sets the starting text. */}
									<input
										className="form-control mb-1"
										placeholder="Name"
										name="author"
										defaultValue={values.author}
									/>
									{errors.author && <div className="error">{errors.author}</div>}
								</div>
								<div className="form-group">
									{/* In HTML a textarea's value is its content. In React it is
									    a prop -- children here would be an error. */}
									<textarea
										className="form-control mb-1"
										placeholder="Review"
										name="content"
										defaultValue={values.content}
									/>
									{errors.content && <div className="error">{errors.content}</div>}
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>

					{reviews.map((review) => (
						<Review key={review.id} review={review} />
					))}
				</div>
			</div>
		</Layout>
	);
}
