describe("Searching for Movies", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	it("can't search for a movie without a title", () => {
		cy.get(`button[type="submit"]`).click();
		cy.get(`[role="alert"]`)
			.should("be.visible")
			.children()
			.contains("Aww, that's cute");
	});

	it("can't search for a movie with a title less than 3 characters", () => {
		cy.get("#formMovieSearch").type("IT");
		cy.get(`button[type="submit"]`).click();
		cy.get(`[role="alert"]`)
			.should("be.visible")
			.children()
			.contains("Wow, that was stupid");
	});

	it("can search for 'The Matrix' and get multiple results", () => {
		cy.get("#formMovieSearch").type("The Matrix");
		cy.get(`button[type="submit"]`).click();
		cy.get(".movie-list").children().should("have.length.at.least", 4);
	});

	it("should show a loading-spinner whilst searching for a movie", () => {
		cy.get("#formMovieSearch").type("The Lord of the Rings");
		cy.get(`button[type="submit"]`).click();
		cy.get("#loading-wrapper").should("be.visible");
		cy.get(".movie-list").children().should("have.length.at.least", 3);
	});

	it("can search for a movie, click on the movie and visit the clicked movie", () => {
		let imdbId: string = "";

		cy.get("#formMovieSearch").type("The Whale");
		cy.get(`button[type="submit"]`).click();
		cy.get(".movie-list").should("be.visible");
		cy.get(".movie-list")
			.children()
			.eq(1)
			.children()
			.first()
			.then(($movieId) => {
				imdbId = $movieId.attr("data-imdb-id");
				console.log(imdbId);
			})
			.within(() => {
				cy.get(".card-link").click();
				cy.location("pathname").should("contain", imdbId);
			});
	});

	it("can search for 'Isaks Memes' and get no results", () => {
		cy.get("#formMovieSearch").type("Isaks Memes");
		cy.get(`button[type="submit"]`).click();
		cy.get(`[role="alert"]`)
			.should("be.visible")
			.children()
			.contains("Movie not found!");
		cy.get(".movie-list").should("not.exist");
	});
});
