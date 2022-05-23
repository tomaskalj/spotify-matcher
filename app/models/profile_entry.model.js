module.exports = mongoose => {
    return mongoose.model(
        "profile_entry",
        mongoose.Schema(
            {
                token: String,
                display_name: String,
                image_url: String,
                top_artists: [String],
                top_genres: [String],
                top_tracks: [String]
            },
            {timestamps: true}
        )
    )
};