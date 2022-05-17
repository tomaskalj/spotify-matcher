module.exports = mongoose => {
    const Entry = mongoose.model(
        "profile_entry",
        mongoose.Schema(
            {
                display_name: String,
                image_url: String,
                top_artists: [String],
                // top_genres: [Schema.Types.Mixed],
                top_tracks: [String]
            },
            { timestamps: true }
        )
    );
    return Entry
};