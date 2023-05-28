type Film = {
    filmId: number,
    title: string,
    releaseDate: string,
    directorId: number,
    directorFirstName: string,
    directorLastName: string,
    rating: number,
    ageRating: string
    genreId: number
}

type FilmFull = {
    description: string,
    numReviews: number,
    runtime: number
} & Film

type FilmReturn = {
    films: film[],
    count: number
}

type Genre = {
    genreId: number,
    name: string
}

type review = {
    reviewerId: number,
    rating: number,
    review: string,
    reviewerFirstName: string,
    reviewerLastName: string
}

type filmSearchQuery = {
    q?: string,
    directorId?: number,
    reviewerId?: number,
    genreIds?: Array<number>,
    ageRatings?: Array<string>,
    sortBy?: string
    count?: number,
    startIndex?: number
}