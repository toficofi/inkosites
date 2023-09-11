import { fork } from 'child_process';
import * as schedule from "node-schedule"

// Start express server
const express = fork('express');

const scraper = schedule.scheduleJob('* * * * *', () => {
    fork('scrape_instagram_profiles')
})