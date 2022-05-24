module.exports = mongoose => {
    return mongoose.model(
        "profile_entry",
        mongoose.Schema(
            {
                user_id: {
                    type: String,
                    unique: true
                },
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